import LazyLoad, { ILazyLoadInstance } from 'vanilla-lazyload';
import * as browser from 'webextension-polyfill';
import NProgress from 'nprogress';
import $ from 'jquery';

import '../../vendors/jquery.simplepagination';
import 'jquery.loadtemplate';
import 'semantic-ui-transition/transition';
import 'semantic-ui-dropdown/dropdown';

declare global {
  interface JQuery {
    loadTemplate: (target: any, data: any, options: any) => any;
  }
}

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
    <div id="year-dropdown" data-filter="year" class="ui dropdown fluid scrolling button uppercase" tabindex="0">
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
let myLazyLoad: ILazyLoadInstance;

function updateFilter(filter: string, value: string | string[]) {
  if (value.length === 0) {
    filters.delete(filter);
  } else {
    filters.set(filter, value.toString());
  }

  if (filter !== 'page' && filters.has('page')) {
    filters.delete('page');
  }

  fetchAnimes();
}

function fetchAnimes() {
  NProgress.start();
  $.getJSON('https://nekosama.codexus.fr/api/animes', filters.toString(), (data: any) => {
    $('#ajax-list-animes').loadTemplate(browser.runtime.getURL('nekosama/search/template.html'), data.animes, {
      isFile: true,
      complete: () => {
        NProgress.done();
        myLazyLoad.update();
      }
    });

    if (data.animes.length === 0) {
      NProgress.done();
      $('#animes-no-results').removeClass('d-none');
      $('#ajax-pagination-wrapper').empty();
    } else {
      const paginationDiv = '<div class="nekosama pagination"></div>';
      const paginateElement: any = $(paginationDiv).pagination({
        pages: data.pagination.total,
        currentPage: data.pagination.current,
        displayedPages: 8,
        useAnchors: false,
        ellipsePageSet: false,
        cssStyle: '',
        prevText: '<svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>',
        nextText: '<svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>',
        onPageClick: (pageNumber: number) => {
          if (filters.has('page')) {
            const page = Number.parseInt(filters.get('page')!, 10);
            if (page === pageNumber) {
              return;
            }
          }

          updateFilter('page', pageNumber.toString());
          $(window).scrollTop(0);
        }
      });

      $('#animes-no-results').addClass('d-none');
      $('#ajax-pagination-wrapper').html(paginateElement);
    }

    const filterUrl = filters.toString();
    if (new URLSearchParams(window.location.search).toString() !== filterUrl) {
      history.pushState(
        {},
        '',
        window.location.pathname + (filterUrl.length > 0 ? '?' : '') + filterUrl
      );
    }
  });
}

$(() => {
  myLazyLoad = new LazyLoad();
  // Ajout des filtres supplémentaires
  $('#sort-dropdown').attr('data-filter', 'sort');
  $('#sort-dropdown > .menu').append(yearSortingMenu);

  $.getJSON('https://nekosama.codexus.fr/api/animes/years', (years: string[]) => {
    let yearsHtml = '';
    for (const year of years) {
      yearsHtml += `<div data-value="${year}" class="item text-uppercase">${year}</div>`;
    }

    $('#filters > .item.genres')
      .before(yearFilter.replace('%YEARS%', yearsHtml));

    // Dropdown filters
    $('.ui.dropdown').dropdown({
      context: $(window.window) as any, // Bypassing the Sandbox object that cause crash in the dropdown library
      onChange(value: string) {
        if ($(this).attr('data-filter') !== undefined) {
          let actualValue = 'null';
          if (filters.has($(this).attr('data-filter')!)) {
            actualValue = filters.get($(this).attr('data-filter')!)!;
          }

          if (value !== actualValue) {
            updateFilter(
              $(this).attr('data-filter')!,
              (value === 'null' ? '' : value)
            );
          }
        }
      }
    });

    ['sort', 'type', 'status', 'year'].forEach(filter => {
      if (filters.has(filter)) {
        $(`.ui.dropdown[data-filter="${filter}"]`)
          .dropdown('set selected', filters.get(filter));
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
  $('.genres .button').on('click', () => {
    if ($('.genres-pop-out').is(':visible')) {
      $('.genres-pop-out').css('display', 'none');
    } else {
      $('.genres-pop-out').css('display', 'block');
    }
  });

  $('.genres-pop-out .item').on('click', function (this: any) {
    $(this).toggleClass('active');

    let genres: string[] = [];
    if (filters.has('genres')) {
      genres = (filters.get('genres')!).split(',');
    }

    if ($(this).hasClass('active') && $(this).attr('data-value') !== undefined) {
      genres.push($(this).attr('data-value')!);
    } else if ($(this).attr('data-value') !== undefined) {
      genres.splice($.inArray($(this).attr('data-value')!, genres), 1);
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
    filters.get('genres')!
      .split(',')
      .forEach(g => $(`.item[data-value="${g}"]`).toggleClass('active'));
  }

  let timerSearch: number;
  $('[name=search]').on('input', function (this: any) {
    window.clearTimeout(timerSearch);

    const search = $.trim($(this).val() as string ?? '');
    timerSearch = window.setTimeout(() => {
      updateFilter('search', search);
    }, 200);
  });
  if (filters.has('search')) {
    $('[name=search]').val(filters.get('search')!);
  }

  window.onpopstate = () => {
    filters = new URLSearchParams(window.location.search);
    fetchAnimes();
  };

  fetchAnimes();
});
