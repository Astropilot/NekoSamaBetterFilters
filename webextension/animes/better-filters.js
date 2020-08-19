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
    <div id="year-dropdown" data-filter="year" class="ui dropdown fluid search button uppercase" tabindex="0">
      <span class="text text-uppercase">TOUTES</span> <i class="dropdown icon"></i>
      <div class="menu uppercase transition hidden" tabindex="-1">
        <div data-value="null" class="item active selected">TOUTES</div>
        %YEARS%
      </div>
    </div>
  </div>
`;

const noResultPage = `
  <div id="animes-no-results" style="padding-bottom: 0" class="d-none">
    <h1>Aucun résultat n'a été trouvé !</h1>
  </div>
`;

let filters = new URLSearchParams(window.location.search);
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
  NProgress.start();
  $.getJSON('https://nekosama.codexus.fr/api/animes', filters.toString(), data => {
    $('#ajax-list-animes').loadTemplate($('#template'), data.animes, {
      isFile: false,
      complete: () => {
        NProgress.done();
      }
    });
    myLazyLoad.update();

    if (data.animes.length === 0) {
      NProgress.done();
    }

    if (data.animes.length > 0) {
      $('#animes-no-results').addClass('d-none');
    } else {
      $('#animes-no-results').removeClass('d-none');
    }

    if (data.animes.length > 0) {
      const paginationDiv = '<div class="nekosama pagination"></div>';
      const paginateElement = $(paginationDiv).pagination({
        pages: data.pagination.total,
        currentPage: data.pagination.current,
        displayedPages: 8,
        useAnchors: false,
        ellipsePageSet: false,
        cssStyle: '',
        prevText: '<svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>',
        nextText: '<svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>',
        onPageClick: pageNumber => {
          if (filters.has('page')) {
            const page = Number.parseInt(filters.get('page'), 10);
            if (page === pageNumber) {
              return;
            }
          }

          updateFilter('page', pageNumber.toString());
          $(window).scrollTop(0);
        }
      });

      $('#ajax-pagination-wrapper').html(paginateElement);
    } else {
      $('#ajax-pagination-wrapper').empty();
    }

    const filterUrl = filters.toString();
    if (new URLSearchParams(window.location.search).toString() !== filterUrl) {
      history.pushState(
        {},
        null,
        window.location.pathname + (filterUrl.length > 0 ? '?' : '') + filterUrl
      );
    }
  });
}

const scriptElement = document.createElement('script');
scriptElement.src = '%NPROGRESS_URL%';
scriptElement.addEventListener('load', () => {
  $(document).ready(() => {
    // Ajout des filtres supplémentaires
    $('#sort-dropdown').attr('data-filter', 'sort');
    $('#sort-dropdown > .menu').append(yearSortingMenu);

    $.getJSON('https://nekosama.codexus.fr/api/animes/years', years => {
      let yearsHtml = '';
      for (const year of years) {
        yearsHtml += `<div data-value="${year}" class="item text-uppercase">${year}</div>`;
      }

      $('#filters > .item.genres')
        .before(yearFilter.replace('%YEARS%', yearsHtml));

      ['sort', 'type', 'status', 'year'].forEach(filter => {
        if (filters.has(filter)) {
          $(`.ui.dropdown[data-filter="${filter}"]`)
            .dropdown('set selected', filters.get(filter));
        }
      });

      // Dropdown filters
      $('.ui.dropdown').dropdown({
        onChange(value) {
          if ($(this).attr('data-filter') !== null) {
            let actualValue = 'null';
            if (filters.has($(this).attr('data-filter'))) {
              actualValue = filters.get($(this).attr('data-filter'));
            }

            if (value !== actualValue) {
              updateFilter(
                $(this).attr('data-filter'),
                (value === 'null' ? '' : value)
              );
            }
          }
        }
      });
    });

    // Suppression de la partie legacy (On force le full ajax)
    $('#ajax-list-animes').removeClass('d-none');
    $('#ajax-list-animes').after(noResultPage);
    // Cet élément est normalement déjà supprimé par le hijack-js.js mais
    // ça ne coûte rien de le laisser au cas où la suppression via le DOM échoue
    $('#regular-list-animes').remove();
    $('#regular-pagination-wrapper')
      .after('<div id="ajax-pagination-wrapper"></div>').remove();

    // Genres Pop Out
    $('.genres .button').click(() => {
      if ($('.genres-pop-out').is(':visible')) {
        $('.genres-pop-out').css('display', 'none');
      } else {
        $('.genres-pop-out').css('display', 'block');
      }
    });

    $('.genres-pop-out .item').click(function () {
      $(this).toggleClass('active');

      let genres = [];
      if (filters.has('genres')) {
        genres = filters.get('genres').split(',');
      }

      if ($(this).hasClass('active')) {
        genres.push($(this).attr('data-value'));
      } else {
        genres.splice($.inArray($(this).attr('data-value'), genres), 1);
      }

      if (genres.length > 0) {
        $('.item.genres > .ui.button').addClass('has-filter');
      } else {
        $('.item.genres > .ui.button').removeClass('has-filter');
      }

      updateFilter('genres', genres);
    });
    if (filters.has('genres')) {
      $('.item.genres > .ui.button').addClass('has-filter');
      filters.get('genres')
        .split(',')
        .forEach(g => $(`.item[data-value="${g}"]`).toggleClass('active'));
    }

    let timerSearch;
    $('[name=search]').on('input', function () {
      clearTimeout(timerSearch);

      const search = $.trim($(this).val());
      timerSearch = setTimeout(() => {
        updateFilter('search', search);
      }, 200);
    });
    if (filters.has('search')) {
      $('[name=search]').val(filters.get('search'));
    }

    window.onpopstate = () => {
      filters = new URLSearchParams(window.location.search);
      fetchAnimes();
    };

    fetchAnimes();
  });
});

document.head.append(scriptElement);
