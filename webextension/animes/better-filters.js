const yearSortingMenu = `
    <div data-value="start_date_year_desc" class="item text-uppercase">
        Année <small>+ au -</small>
    </div>
    <div data-value="start_date_year_asc" class="item text-uppercase">
        Année <small>- au +</small>
    </div>
`;

const yearFilter = `
    <div class="item">
        <p class="title">Année</p>
        <div id="year-dropdown" data-filter="year" class="ui dropdown fluid button uppercase" tabindex="0">
            <span class="text text-uppercase">TOUTES</span> <i class="dropdown icon"></i>
            <div class="menu uppercase transition hidden" tabindex="-1">
                <div data-value="null" class="item active selected">TOUTES</div>
                <div data-value="2020" class="item text-uppercase">2020</div>
                <div data-value="2019" class="item text-uppercase">2019</div>
                <div data-value="2018" class="item text-uppercase">2018</div>
            </div>
        </div>
    </div>
`;

const noResultPage = `
    <div id="animes-no-results" style="padding-bottom: 0" class="d-none">
        <h1>Aucun résultat n'a été trouvé !</h1>
    </div>
`;

var filters = new URLSearchParams(window.location.search);
const myLazyLoad = new LazyLoad();

function updateFilter(filter, value) {
    if (value.length === 0) {
        filters.delete(filter);
    } else {
        filters.set(filter, value);
    }
    if (filter !== 'page' && filters.has('page')) {
        filters.delete('page');
    }
    fetchAnimes();
}

function fetchAnimes() {
    $('#loading').addClass('active');
    $.getJSON('https://nekosama.codexus.fr/api/animes', filters.toString(), function (data) {

        $("#ajax-list-animes").loadTemplate($("#template"), data.animes, {
            isFile: false,
            complete: function() {
                $('#loading').removeClass('active');
                myLazyLoad.update();
            }
        });

        if (data.animes.length === 0) $('#loading').removeClass('active');

        data.animes.length > 0 ? $('#animes-no-results').addClass('d-none') : $('#animes-no-results').removeClass('d-none');

        if (data.animes.length > 0) {
            const paginateElement = $('<div class="nekosama pagination"></div>').pagination({
                pages: data.pagination.total,
                currentPage: data.pagination.current,
                displayedPages: 8,
                useAnchors: false,
                ellipsePageSet: false,
                cssStyle: '',
                prevText: '<svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>',
                nextText: '<svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>',
                onPageClick: function (pageNumber) {
                    if (filters.has('page')) {
                        page = parseInt(filters.get('page'), 10);
                        if (page === pageNumber) return;
                    }
                    updateFilter('page', pageNumber.toString());
                    $(window).scrollTop(0);
                }
            });

            $('#ajax-pagination-wrapper').html(paginateElement);
        } else {
            $('#ajax-pagination-wrapper').empty();
        }

        filter_url = filters.toString();
        if (new URLSearchParams(window.location.search).toString() !== filter_url) {
            history.pushState({}, null, window.location.pathname + (filter_url.length > 0 ? '?': '') + filter_url);
        }
    });
}


$(document).ready(function () {

    // Ajout des filtres supplémentaires
    $('#sort-dropdown').attr('data-filter', 'sort');
    $('#sort-dropdown > .menu').append(yearSortingMenu);
    $('#filters > .item.genres').before(yearFilter);

    // Suppression de la partie legacy (On force le full ajax)
    $('#ajax-list-animes').removeClass('d-none');
    $('#ajax-list-animes').after(noResultPage);
    $('#regular-list-animes').remove();
    $('#regular-pagination-wrapper').after(`<div id="ajax-pagination-wrapper"></div>`).remove();

    // Genres Pop Out
    $('.genres .button').click(function () {
        if ($('.genres-pop-out').is(':visible')) {
            $('.genres-pop-out').css('display', 'none');
        } else {
            $('.genres-pop-out').css('display', 'block');
        }
    })

    $('.genres-pop-out .item').click(function () {
        $(this).toggleClass('active');

        var genres = [];
        if (filters.has('genres'))
            genres = filters.get('genres').split(',');
        if ($(this).hasClass('active')) {
            genres.push($(this).attr('data-value'));
        } else {
            genres.splice($.inArray($(this).attr('data-value'), genres), 1);
        }
        updateFilter('genres', genres);
    });
    if (filters.has('genres')) {
        filters.get('genres').split(',').forEach(g => $(`.item[data-value="${g}"]`).toggleClass('active'));
    }

    ['sort', 'type', 'status', 'year'].forEach(function (filter) {
        if (filters.has(filter)) {
            $(`.ui.dropdown[data-filter="${filter}"]`).dropdown('set selected', filters.get(filter));
        }
    });

    // Dropdown filters
    $('.ui.dropdown').dropdown({
        onChange: function(value, text, $selectedItem) {
            if ($(this).attr('data-filter') != null) {
                updateFilter(
                    $(this).attr('data-filter'),
                    (value !== 'null' ? value : '')
                );
            }
        }
    });

    var timerSearch;
    $('[name=search]').on('input', function () {
        clearTimeout(timerSearch);

        const search = $.trim($(this).val());
        timerSearch = setTimeout(function () {
            updateFilter('search', search);
        }, 200);
    });
    if (filters.has('search')) {
        $('[name=search]').val(filters.get('search'));
    }

    window.onpopstate = function(event) {
        filters = new URLSearchParams(window.location.search);
        fetchAnimes();
    };

    fetchAnimes();
});
