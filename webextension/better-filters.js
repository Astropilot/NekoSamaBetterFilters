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

/*! (c) Andrea Giammarchi - ISC */
var self=this||{};try{!function(t,e){if(new t("q=%2B").get("q")!==e||new t({q:e}).get("q")!==e||new t([["q",e]]).get("q")!==e||"q=%0A"!==new t("q=\n").toString()||"q=+%26"!==new t({q:" &"}).toString()||"q=%25zx"!==new t({q:"%zx"}).toString())throw t;self.URLSearchParams=t}(URLSearchParams,"+")}catch(t){!function(t,a,o){"use strict";var u=t.create,h=t.defineProperty,e=/[!'\(\)~]|%20|%00/g,n=/%(?![0-9a-fA-F]{2})/g,r=/\+/g,i={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+","%00":"\0"},s={append:function(t,e){p(this._ungap,t,e)},delete:function(t){delete this._ungap[t]},get:function(t){return this.has(t)?this._ungap[t][0]:null},getAll:function(t){return this.has(t)?this._ungap[t].slice(0):[]},has:function(t){return t in this._ungap},set:function(t,e){this._ungap[t]=[a(e)]},forEach:function(e,n){var r=this;for(var i in r._ungap)r._ungap[i].forEach(t,i);function t(t){e.call(n,t,a(i),r)}},toJSON:function(){return{}},toString:function(){var t=[];for(var e in this._ungap)for(var n=v(e),r=0,i=this._ungap[e];r<i.length;r++)t.push(n+"="+v(i[r]));return t.join("&")}};for(var c in s)h(f.prototype,c,{configurable:!0,writable:!0,value:s[c]});function f(t){var e=u(null);switch(h(this,"_ungap",{value:e}),!0){case!t:break;case"string"==typeof t:"?"===t.charAt(0)&&(t=t.slice(1));for(var n=t.split("&"),r=0,i=n.length;r<i;r++){var a=(s=n[r]).indexOf("=");-1<a?p(e,g(s.slice(0,a)),g(s.slice(a+1))):s.length&&p(e,g(s),"")}break;case o(t):for(var s,r=0,i=t.length;r<i;r++){p(e,(s=t[r])[0],s[1])}break;case"forEach"in t:t.forEach(l,e);break;default:for(var c in t)p(e,c,t[c])}}function l(t,e){p(this,e,t)}function p(t,e,n){var r=o(n)?n.join(","):n;e in t?t[e].push(r):t[e]=[r]}function g(t){return decodeURIComponent(t.replace(n,"%25").replace(r," "))}function v(t){return encodeURIComponent(t).replace(e,d)}function d(t){return i[t]}self.URLSearchParams=f}(Object,String,Array.isArray)}!function(d){var r=!1;try{r=!!Symbol.iterator}catch(t){}function t(t,e){var n=[];return t.forEach(e,n),r?n[Symbol.iterator]():{next:function(){var t=n.shift();return{done:void 0===t,value:t}}}}"forEach"in d||(d.forEach=function(n,r){var i=this,t=Object.create(null);this.toString().replace(/=[\s\S]*?(?:&|$)/g,"=").split("=").forEach(function(e){!e.length||e in t||(t[e]=i.getAll(e)).forEach(function(t){n.call(r,t,e,i)})})}),"keys"in d||(d.keys=function(){return t(this,function(t,e){this.push(e)})}),"values"in d||(d.values=function(){return t(this,function(t,e){this.push(t)})}),"entries"in d||(d.entries=function(){return t(this,function(t,e){this.push([e,t])})}),!r||Symbol.iterator in d||(d[Symbol.iterator]=d.entries),"sort"in d||(d.sort=function(){for(var t,e,n,r=this.entries(),i=r.next(),a=i.done,s=[],c=Object.create(null);!a;)e=(n=i.value)[0],s.push(e),e in c||(c[e]=[]),c[e].push(n[1]),a=(i=r.next()).done;for(s.sort(),t=0;t<s.length;t++)this.delete(s[t]);for(t=0;t<s.length;t++)e=s[t],this.append(e,c[e].shift())}),function(f){function l(t){var e=t.append;t.append=d.append,URLSearchParams.call(t,t._usp.search.slice(1)),t.append=e}function p(t,e){if(!(t instanceof e))throw new TypeError("'searchParams' accessed on an object that does not implement interface "+e.name)}function t(e){var n,r,i,t=e.prototype,a=v(t,"searchParams"),s=v(t,"href"),c=v(t,"search");function o(t,e){d.append.call(this,t,e),t=this.toString(),i.set.call(this._usp,t?"?"+t:"")}function u(t){d.delete.call(this,t),t=this.toString(),i.set.call(this._usp,t?"?"+t:"")}function h(t,e){d.set.call(this,t,e),t=this.toString(),i.set.call(this._usp,t?"?"+t:"")}!a&&c&&c.set&&(i=c,r=function(t,e){return t.append=o,t.delete=u,t.set=h,g(t,"_usp",{configurable:!0,writable:!0,value:e})},n=function(t,e){return g(t,"_searchParams",{configurable:!0,writable:!0,value:r(e,t)}),e},f.defineProperties(t,{href:{get:function(){return s.get.call(this)},set:function(t){var e=this._searchParams;s.set.call(this,t),e&&l(e)}},search:{get:function(){return c.get.call(this)},set:function(t){var e=this._searchParams;c.set.call(this,t),e&&l(e)}},searchParams:{get:function(){return p(this,e),this._searchParams||n(this,new URLSearchParams(this.search.slice(1)))},set:function(t){p(this,e),n(this,t)}}}))}var g=f.defineProperty,v=f.getOwnPropertyDescriptor;try{t(HTMLAnchorElement),/^function|object$/.test(typeof URL)&&URL.prototype&&t(URL)}catch(t){}}(Object)}(self.URLSearchParams.prototype,Object);

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

const filters = new URLSearchParams(window.location.search);
var myLazyLoad = new LazyLoad();

function updateFilter(filter, value) {
    if (value.length === 0) {
        filters.delete(filter);
    } else {
        filters.set(filter, value);
    }
    filter_url = filters.toString();
    history.pushState({}, null, window.location.pathname + (filter_url.length > 0 ? '?': '') + filter_url);
    fetchAnimes();
}

function fetchAnimes() {
    $.getJSON('http://127.0.0.1:5000/api/animes', filters.toString(), function (data) {
        window.location.hash = '';

        $("#ajax-list-animes").loadTemplate($("#template"), data.animes, {
            complete: function() {
                myLazyLoad.update();
            }
        });

        const paginateElement = $('<div class="nekosama pagination"></div>').pagination({
            pages: data.pagination.total,
            currentPage: data.pagination.current,
            displayedPages: 8,
            cssStyle: '',
            prevText: '<svg viewBox="0 0 24 24"><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path></svg>',
            nextText: '<svg viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></path></svg>',
            onPageClick: function (pageNumber) {
                updateFilter('page', pageNumber.toString());
            }
        });

        $('#ajax-pagination-wrapper').html(paginateElement);

        $('#ajax-pagination-wrapper a[class="page-link"]').on('click', function () {
            $(window).scrollTop(0);
        });
    });
}


$(document).ready(function () {

    // Ajout des filtres supplémentaires
    $('#sort-dropdown > .menu').append(yearSortingMenu);
    $('#filters > .item.genres').before(yearFilter);

    // Suppression de la partie legacy (On force le full ajax)
    $('#ajax-list-animes').removeClass('d-none');
    $('#regular-list-animes').remove();
    $('#regular-pagination-wrapper').after(`<div id="ajax-pagination-wrapper">
</div>`).remove();

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

    // Dropdown filter
    $('.ui.dropdown').dropdown({
        onChange: function(value, text, $selectedItem) {

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

    fetchAnimes();
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
