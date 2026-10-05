/* =========================================================
   TRACKING DE ORIGEM + CTAs
   GOOGLE / META -> HOTMART + GOOGLE ANALYTICS 4

   - Preserva UTMs e parâmetros de anúncio
   - Last Identifiable Click
   - TTL de 30 minutos
   - Envia parâmetros para a Hotmart
   - Identifica qual CTA foi clicado no GA4
   - Identifica cliques de CTA no GA4
========================================================= */

(function () {

  /* =========================================================
     CONSTANTES
  ========================================================= */

  var STORAGE_KEY = 'traffic_tracking';
  var TTL_MS = 30 * 60 * 1000;

  var TRACKING_PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'utm_placement',
    'gclid',
    'gbraid',
    'wbraid',
    'fbclid'
  ];

  var SOURCE_IDENTIFIERS = [
    'fbclid',
    'gclid',
    'gbraid',
    'wbraid',
    'utm_source'
  ];


  /* =========================================================
     SESSÃO DE TRACKING COM TTL
  ========================================================= */

  function loadTracking() {

    try {

      var raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return {};
      }

      var data = JSON.parse(raw);

      if (
        data._ts &&
        (Date.now() - data._ts > TTL_MS)
      ) {

        localStorage.removeItem(STORAGE_KEY);

        return {};

      }

      return data;

    } catch (e) {

      return {};

    }

  }


  function saveTracking(data) {

    try {

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );

    } catch (e) {

      // Não interromper a navegação

    }

  }


  function captureTrackingParams() {

    var currentParams =
      new URLSearchParams(window.location.search);

    var hasNewSource = false;


    SOURCE_IDENTIFIERS.forEach(function (param) {

      if (currentParams.get(param)) {
        hasNewSource = true;
      }

    });


    var savedTracking = loadTracking();


    /*
       LAST IDENTIFIABLE CLICK

       Uma nova origem identificável substitui
       completamente a origem anterior.
    */

    if (hasNewSource) {
      savedTracking = {};
    }


    var hasAnyParam = false;


    TRACKING_PARAMS.forEach(function (param) {

      var value = currentParams.get(param);

      if (value) {

        savedTracking[param] = value;

        hasAnyParam = true;

      }

    });


    if (hasAnyParam || hasNewSource) {
      savedTracking._ts = Date.now();
    }


    saveTracking(savedTracking);

    return savedTracking;

  }


  /* =========================================================
     VERIFICAÇÃO HOTMART
  ========================================================= */

  function isHotmartLink(url) {

    var hostname = url.hostname.toLowerCase();

    return (
      hostname === 'pay.hotmart.com' ||
      hostname.endsWith('.hotmart.com') ||
      hostname === 'go.hotmart.com'
    );

  }


  /* =========================================================
     SCK PARA HOTMART

     Formato:
     utm_source|utm_medium|utm_campaign
  ========================================================= */

  function buildSck(tracking) {

    var parts = [];


    if (tracking.utm_source) {
      parts.push(tracking.utm_source);
    }

    if (tracking.utm_medium) {
      parts.push(tracking.utm_medium);
    }

    if (tracking.utm_campaign) {
      parts.push(tracking.utm_campaign);
    }


    if (parts.length === 0) {
      return null;
    }


    return parts
      .join('|')
      .substring(0, 255);

  }


  /* =========================================================
     APLICAR TRACKING NOS LINKS HOTMART
  ========================================================= */

  function applyTracking(link) {

    try {

      var url =
        new URL(link.href, window.location.origin);


      if (!isHotmartLink(url)) {
        return;
      }


      var tracking = loadTracking();


      TRACKING_PARAMS.forEach(function (param) {

        if (tracking[param]) {

          url.searchParams.set(
            param,
            tracking[param]
          );

        }

      });


      /*
         Adicionar SCK somente quando
         o link ainda não possuir um.
      */

      if (!url.searchParams.has('sck')) {

        var sck = buildSck(tracking);

        if (sck) {
          url.searchParams.set('sck', sck);
        }

      }


      link.href = url.toString();

    } catch (e) {

      // Não interromper a navegação

    }

  }


  function applyTrackingToAllLinks() {

    document
      .querySelectorAll('a[href]')
      .forEach(applyTracking);

  }


  /* =========================================================
     LOCALIZAÇÃO DO CTA
  ========================================================= */

  function getCtaLocation(link) {

    /*
       data-cta-location é opcional.

       Se existir, tem prioridade.
    */

    if (link.dataset.ctaLocation) {
      return link.dataset.ctaLocation;
    }


    /*
       Caso contrário, usar o ID
       da section automaticamente.
    */

    var section = link.closest('section');

    if (section && section.id) {
      return section.id;
    }


    return 'pagina';

  }


  /* =========================================================
     TRACKING DOS CTAs NO GOOGLE ANALYTICS 4
  ========================================================= */

  function trackCtaClick(link) {

    /*
       Somente elementos identificados
       explicitamente com data-cta.
    */

    var ctaName = link.dataset.cta;

    if (!ctaName) {
      return;
    }


    /*
       Não bloquear o botão caso o GA4
       ainda não tenha carregado.
    */

    if (typeof window.gtag !== 'function') {
      return;
    }


    var rawHref =
      link.getAttribute('href') || '';


    var ctaText =
      (link.textContent || '')
        .replace(/\s+/g, ' ')
        .trim();


    var ctaLocation =
      getCtaLocation(link);


    var destinationType = 'other';



    /*
       Âncora interna
    */

    if (rawHref.charAt(0) === '#') {

      destinationType =
        'internal_anchor';

    }


    /*
       Verificar checkout Hotmart
    */

    try {

      var url =
        new URL(
          link.href,
          window.location.origin
        );


      if (isHotmartLink(url)) {

        destinationType =
          'checkout';


      }

    } catch (e) {

      // Não interromper o clique

    }


    /* =====================================================
       EVENTO GERAL DE CTA
    ===================================================== */

    window.gtag(
      'event',
      'cta_click',
      {

        cta_name:
          ctaName,

        cta_text:
          ctaText,

        cta_location:
          ctaLocation,

        cta_destination:
          rawHref,

        destination_type:
          destinationType

      }
    );
  }


  /* =========================================================
     INICIALIZAÇÃO
  ========================================================= */

  /*
     Capturar UTMs / parâmetros de anúncio
     assim que o arquivo carregar.
  */

  captureTrackingParams();


  /* =========================================================
     DOM PRONTO
  ========================================================= */

  document.addEventListener(
    'DOMContentLoaded',
    function () {

      /*
         Aplicar parâmetros aos links
         Hotmart já existentes.
      */

      applyTrackingToAllLinks();


      /*
         Observar links que eventualmente
         forem adicionados dinamicamente.
      */

      var debounceTimer;


      var observer =
        new MutationObserver(
          function () {

            clearTimeout(
              debounceTimer
            );


            debounceTimer =
              setTimeout(
                applyTrackingToAllLinks,
                300
              );

          }
        );


      observer.observe(
        document.body,
        {

          childList:
            true,

          subtree:
            true

        }
      );

    }
  );


  /* =========================================================
     CLIQUES

     UM ÚNICO LISTENER:

     1. Garante tracking da Hotmart
     2. Registra CTA no GA4
  ========================================================= */

  document.addEventListener(
    'click',
    function (event) {

      var link =
        event.target.closest(
          'a[href]'
        );


      if (!link) {
        return;
      }


      /*
         Atualizar parâmetros Hotmart
         antes da navegação.
      */

      applyTracking(link);


      /*
         Registrar no GA4 somente
         links marcados com data-cta.
      */

      if (link.dataset.cta) {
        trackCtaClick(link);
      }

    },
    true
  );


})();
