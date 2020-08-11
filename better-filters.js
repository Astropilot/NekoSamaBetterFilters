/*******************************************************************************
* PROJECT: Neko-Sama Better Filters
*
* AUTHORS: Yohann Martin
*
* DATE: 2020
*
* Copyright (c) 2019 Yohann MARTIN (@Astropilot). All rights reserved.
*
* Licensed under the MIT License. See LICENSE file in the project root for full
* license information.
*******************************************************************************/

const yearSortingMenu = `
    <div data-value="year_desc" class="item text-uppercase">
        Année <small>+ au -</small>
    </div>
    <div data-value="year_asc" class="item text-uppercase">
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

$(document).ready(function () {

    // Ajout des filtres supplémentaires
    $('#sort-dropdown > .menu').append(yearSortingMenu);
    $('#filters > .item.genres').before(yearFilter);

    // Suppression de la partie legacy (On force le full ajax)
    $('.nekosama-animes').remove();
    $('#regular-pagination-wrapper').remove();

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
    });

    // Paginate
    $(document).on('click', 'a[data-page]:not(.disabled)', function () {
        $(window).scrollTop(0);
    });

    // Dropdown filter
    $('.ui.dropdown').dropdown({
        onChange: function(value, text, $selectedItem) {

        }
    });
});

/*
var myLazyLoad = new LazyLoad();
var urlsearch = "/animes-search.json?gkeorgkeogkccc";
var idx = null;
var idxById = {};
var idxLength = 0;
var paginateElement = null;

$.getJSON(urlsearch, function (data) {
    $(data).each(function (id, row) {
        idxById[row.id] = row;
        idxLength++;
    });

    idx = lunr(function () {
        var self = this;

        self.pipeline.remove(lunr.stemmer)
        self.pipeline.remove(lunr.stopWordFilter)

        self.ref('id');
        self.field('title', { boost: 2 });
        self.field('title_english', { boost: 2 });
        self.field('title_romanji', { boost: 2 });
        self.field('others');
        self.field('type');
        self.field('status');

        $(data).each(function (id, row) {
            self.add(row, { boost: row.popularity });
        });
    });

    paginateElement = $('<div class="pagination" id="ajax-paginate"></div>').pagination({
        items: (idxLength % 56) + (idxLength % 56 <= 0 ? 0 : 1),
        itemOnPage: 56,
        currentPage: 1,
        displayedPages: 8,
        cssStyle: '',
        prevText: '<svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>',
        nextText: '<svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>',
        onInit: function () {
            // fire first page loading
        },
        onPageClick: function (num, evt) {
            var resultAnimes = Object.entries(idxById).slice(56 * (num - 1), 56 * num).map(function (elem) {
                return elem[1];
            });

            $(".nekosama-animes").loadTemplate($("#template"), resultAnimes);
        }
    });
})

$(document).ready(function () {

    var updateListing = function (results) {
        if (results.length > 0) {
            $('#ajax-list-animes').removeClass('d-none');
            $('#regular-list-animes').addClass('d-none');

            $("#ajax-list-animes").loadTemplate($("#template"), results);

            $('#regular-pagination-wrapper').addClass('d-none');
            if ($('#ajax-pagination-wrapper').text() == '') {
                $('#ajax-pagination-wrapper').append(paginateElement);
            }
        } else {
            $('#ajax-list-animes').addClass('d-none');
            $('#regular-list-animes').removeClass('d-none');

            $('#regular-pagination-wrapper').removeClass('d-none');
            $('#ajax-pagination-wrapper').addClass('d-none');
        }
    }

    // Search override
    var timerSearch;
    $('[name=search]').on('input', function () {
        var filters = {'search': $.trim($(this).val())};

        if (filters['search'].length < 1) {
            updateListing([]);
            return;
        }

        if (filters['search'].split(' ').length <= 1) {
            filters['search'] = $.trim(filters['search']) + '*';
        } else {
            var words = filters['search'].split(' ');
            if (words[words.length - 1].length > 3) {
                words[words.length - 1] = words[words.length - 1] + '*';
            }
            filters['search'] = $.trim(words.join(' '));
        }

        clearTimeout(timerSearch);

        timerSearch = setTimeout(function () {
            applyFilterAnime(filters);
        }, 50);
    });

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

        var filters = getFilters(window.location.hash);
        filters['genres'] = filters['genres'] || [];

        if ($(this).hasClass('active')) {
            filters['genres'].push($(this).attr('data-value'));
        } else {
            filters['genres'].pop($(this).attr('data-value'));
        }

        filters['genres'] = $.unique(filters['genres']);
        applyFilterAnime(filters);
    });

    // Paginate
    $(document).on('click', 'a[data-page]:not(.disabled)', function () {
        var filters = getFilters(window.location.hash);
        filters['page'] = $(this).attr('data-page');
        applyFilterAnime(filters);
        $(window).scrollTop(0);
    });

    // Dropdown filter
    $('.ui.dropdown').dropdown({
        onChange: function(value, text, $selectedItem) {
            var filters = getFilters(window.location.hash);
            if ($(this).attr('data-filter') != null) {
                filters[$(this).attr('data-filter')] = value;
            }
            filters['page'] = '1';
            applyFilterAnime(filters);
        }
    });

    // Filtre depuis l'ancre
    function applyFilterAnime(filter) {

        var result = idx.query(function (q) {

            lunr.tokenizer(filter['search']).forEach(function (token) {
                q.term(token.toString(), {
                    fields: [
                        'title', 'title_english', 'title_romanji', 'others'
                    ]
                });
            });

            if (typeof filter['type'] !== 'undefined' && filter['type'] != '') {
                q.term(filter['type'], {fields: ['type']});
            }

            if (typeof filter['status'] !== 'undefined' && filter['status'] != '') {
                q.term(filter['status'], {fields: ['status']});
            }
        });
        var resultAnimes = [];
        var maxSafeResult = Math.min(result.length, 56);

        for (var i = 0; i < maxSafeResult; i++) {
            resultAnimes.push(idxById[result[i].ref]);
        }

        if (maxSafeResult <= 0) {
            updateListing([]);
        } else {
            updateListing(resultAnimes);
        }
    }

    function getFilters(hash) {
        try {
            hash = decodeURIComponent(hash.replace('#', ''));
            hash = $.parseJSON(hash);
            hash['search'] = hash['search'] || '';
            return hash;
        } catch (e) {
            return {'search': ''};
        }
    }

    if (window.location.hash.length > 2) {
        applyFilterAnime(getFilters(window.location.hash));
    }
});
*/
