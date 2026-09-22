/* ==========================================================
   CARROSSEL DE COMPARAÇÃO
   COMPATÍVEL COM HTML ATUAL
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){


        const carousel =
            document.querySelector(
                "[data-comparison-carousel]"
            );


        if(!carousel) return;



        const track =
            carousel.querySelector(
                "[data-comparison-track]"
            );


        const cards =
            carousel.querySelectorAll(
                "[data-comparison-card]"
            );


        const prevButton =
            carousel.querySelector(
                "[data-comparison-prev]"
            );


        const nextButton =
            carousel.querySelector(
                "[data-comparison-next]"
            );


        const dotsContainer =
            carousel.querySelector(
                "[data-comparison-dots]"
            );



        if(
            !track ||
            !cards.length
        ){

            return;

        }



        let currentIndex = 0;

        let autoPlayTimer;



        function updateCarousel(){


            track.style.transform =
                "translateX(-" +
                (currentIndex * 100) +
                "%)";


            if(dotsContainer){


                const dots =
                    dotsContainer.querySelectorAll(
                        "button"
                    );


                dots.forEach(
                    function(dot,index){


                        dot.classList.toggle(
                            "active",
                            index === currentIndex
                        );


                    }
                );


            }


        }





        function goToSlide(index){


            if(index < 0){


                currentIndex =
                    cards.length - 1;


            }
            else if(
                index >= cards.length
            ){


                currentIndex = 0;


            }
            else{


                currentIndex = index;


            }


            updateCarousel();


        }





        function createDots(){


            if(!dotsContainer)
                return;


            dotsContainer.innerHTML = "";


            cards.forEach(
                function(_,index){


                    const dot =
                        document.createElement(
                            "button"
                        );


                    dot.type =
                        "button";


                    dot.className =
                        "comparison-dot";


                    dot.setAttribute(
                        "aria-label",
                        "Ir para comparação " +
                        (index + 1)
                    );


                    if(index === 0){


                        dot.classList.add(
                            "active"
                        );


                    }


                    dot.addEventListener(
                        "click",
                        function(){


                            goToSlide(index);

                            restartAutoPlay();


                        }
                    );


                    dotsContainer.appendChild(
                        dot
                    );


                }
            );


        }





        function startAutoPlay(){


            stopAutoPlay();


            autoPlayTimer =
                setInterval(
                    function(){


                        goToSlide(
                            currentIndex + 1
                        );


                    },
                    5000
                );


        }





        function stopAutoPlay(){


            if(autoPlayTimer){


                clearInterval(
                    autoPlayTimer
                );


                autoPlayTimer = null;


            }


        }





        function restartAutoPlay(){


            stopAutoPlay();

            startAutoPlay();


        }





        if(nextButton){


            nextButton.addEventListener(
                "click",
                function(){


                    goToSlide(
                        currentIndex + 1
                    );


                    restartAutoPlay();


                }
            );


        }





        if(prevButton){


            prevButton.addEventListener(
                "click",
                function(){


                    goToSlide(
                        currentIndex - 1
                    );


                    restartAutoPlay();


                }
            );


        }





        carousel.addEventListener(
            "mouseenter",
            stopAutoPlay
        );


        carousel.addEventListener(
            "mouseleave",
            startAutoPlay
        );





        let touchStartX = 0;



        track.addEventListener(
            "touchstart",
            function(event){


                touchStartX =
                    event.changedTouches[0].screenX;


            },
            {
                passive:true
            }
        );





        track.addEventListener(
            "touchend",
            function(event){


                const touchEndX =
                    event.changedTouches[0].screenX;



                if(
                    touchStartX - touchEndX > 50
                ){


                    goToSlide(
                        currentIndex + 1
                    );


                }



                if(
                    touchEndX - touchStartX > 50
                ){


                    goToSlide(
                        currentIndex - 1
                    );


                }


                restartAutoPlay();


            },
            {
                passive:true
            }
        );





createDots();

updateCarousel();

/*
 * O autoplay não é necessário para a renderização inicial.
 * Espera o carregamento completo da página para evitar
 * competir com imagens, fontes e recursos críticos.
 */
if (document.readyState === "complete") {

    startAutoPlay();

} else {

    window.addEventListener(
        "load",
        startAutoPlay,
        { once: true }
    );

}



    }
);





/* ==========================================================
   FAQ ACORDEÃO
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){


        const faqList =
            document.querySelector(
                ".faq-list"
            );


        const faqItems =
            document.querySelectorAll(
                ".faq-item"
            );


        if(!faqList){

            return;

        }



        faqList.addEventListener(
            "click",
            function(event){


                const question =
                    event.target.closest(
                        ".faq-question"
                    );


                if(!question){

                    return;

                }



                const currentItem =
                    question.closest(
                        ".faq-item"
                    );


                const aberto =
                    currentItem.classList.contains(
                        "active"
                    );



                faqItems.forEach(
                    function(item){


                        item.classList.remove(
                            "active"
                        );


                        const button =
                            item.querySelector(
                                ".faq-question"
                            );


                        if(button){

                            button.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }


                    }
                );



                if(!aberto){


                    currentItem.classList.add(
                        "active"
                    );


                    question.setAttribute(
                        "aria-expanded",
                        "true"
                    );


                }


            }
        );


    }
);

/* ==========================================================
   ANIMAÇÕES DE ENTRADA
   Com fallback de segurança
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const elementos = document.querySelectorAll(".fade-in");

    if (!elementos.length) {
        return;
    }

    const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /*
     * Sem animação quando o usuário prefere
     * movimento reduzido.
     */
    if (reduzirMovimento) {

        elementos.forEach(function (elemento) {
            elemento.classList.add("visible");
        });

        return;
    }


    /*
     * Fallback para navegadores sem
     * IntersectionObserver.
     */
    if (!("IntersectionObserver" in window)) {

        elementos.forEach(function (elemento) {
            elemento.classList.add("visible");
        });

        return;
    }


    const observer = new IntersectionObserver(
        function (entries, observerInstance) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observerInstance.unobserve(
                        entry.target
                    );
                }

            });

        },
        {
            threshold: 0.05,
            rootMargin: "0px 0px -20px 0px"
        }
    );


    elementos.forEach(function (elemento) {
        observer.observe(elemento);
    });


    /*
     * FALLBACK DE SEGURANÇA
     *
     * Se por qualquer motivo o observer não atualizar
     * corretamente durante o carregamento, garantimos
     * que nenhuma seção permaneça invisível.
     */
    window.addEventListener(
        "load",
        function () {

            setTimeout(function () {

                elementos.forEach(function (elemento) {

                    const rect =
                        elemento.getBoundingClientRect();

                    if (
                        rect.top < window.innerHeight * 1.25
                    ) {
                        elemento.classList.add("visible");
                    }

                });

            }, 300);

        },
        { once: true }
    );

});




/* ==========================================================
   SMOOTH SCROLL
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){


        const links =
            document.querySelectorAll(
                'a[href^="#"]'
            );



        links.forEach(
            function(link){


                link.addEventListener(
                    "click",
                    function(event){


                        const id =
                            this.getAttribute(
                                "href"
                            );



                        /*
                         * Ignora links vazios.
                         */

                        if(
                            id === "#" ||
                            id === ""
                        ){

                            return;

                        }





                        let destino = null;



                        /*
                         * Evita erro caso exista
                         * href inválido.
                         */

                        try {


                            destino =
                                document.querySelector(
                                    id
                                );


                        } catch(error) {


                            return;


                        }





                        if(destino){


                            event.preventDefault();



                            destino.scrollIntoView(
                                {

                                    behavior:
                                        window.matchMedia(
                                            "(prefers-reduced-motion: reduce)"
                                        ).matches

                                        ? "auto"

                                        : "smooth"

                                }
                            );


                        }



                    }
                );


            }
        );



    }
);

/* ==========================================================
   MODAIS
   TERMOS DE USO + POLÍTICA DE PRIVACIDADE
========================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){


        const openTerms =
            document.getElementById(
                "openTerms"
            );


        const openPrivacy =
            document.getElementById(
                "openPrivacy"
            );


        const termsModal =
            document.getElementById(
                "termsModal"
            );


        const privacyModal =
            document.getElementById(
                "privacyModal"
            );


        const closeTerms =
            document.getElementById(
                "closeTerms"
            );


        const closePrivacy =
            document.getElementById(
                "closePrivacy"
            );



        function openModal(modal){


            if(!modal){

                return;

            }



            modal.classList.add(
                "active"
            );


            modal.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.style.overflow =
                "hidden";


        }





        function closeModal(modal){


            if(!modal){

                return;

            }



            modal.classList.remove(
                "active"
            );


            modal.setAttribute(
                "aria-hidden",
                "true"
            );



            const outroModalAberto =
                document.querySelector(
                    ".legal-modal.active"
                );



            if(!outroModalAberto){


                document.body.style.overflow =
                    "";


            }


        }




        /*
         * ABRIR TERMOS
         */


        if(
            openTerms &&
            termsModal
        ){


            openTerms.addEventListener(
                "click",
                function(event){


                    event.preventDefault();


                    openModal(
                        termsModal
                    );


                }
            );


        }





        /*
         * ABRIR PRIVACIDADE
         */


        if(
            openPrivacy &&
            privacyModal
        ){


            openPrivacy.addEventListener(
                "click",
                function(event){


                    event.preventDefault();


                    openModal(
                        privacyModal
                    );


                }
            );


        }





        /*
         * FECHAR PELO X
         */


        if(
            closeTerms &&
            termsModal
        ){


            closeTerms.addEventListener(
                "click",
                function(){


                    closeModal(
                        termsModal
                    );


                }
            );


        }





        if(
            closePrivacy &&
            privacyModal
        ){


            closePrivacy.addEventListener(
                "click",
                function(){


                    closeModal(
                        privacyModal
                    );


                }
            );


        }





        /*
         * FECHAR CLICANDO FORA
         */


        if(termsModal){


            termsModal.addEventListener(
                "click",
                function(event){


                    if(
                        event.target ===
                        termsModal
                    ){


                        closeModal(
                            termsModal
                        );


                    }


                }
            );


        }





        if(privacyModal){


            privacyModal.addEventListener(
                "click",
                function(event){


                    if(
                        event.target ===
                        privacyModal
                    ){


                        closeModal(
                            privacyModal
                        );


                    }


                }
            );


        }





        /*
         * FECHAR COM ESC
         */


        document.addEventListener(
            "keydown",
            function(event){


                if(
                    event.key !==
                    "Escape"
                ){

                    return;

                }



                if(
                    termsModal &&
                    termsModal.classList.contains(
                        "active"
                    )
                ){


                    closeModal(
                        termsModal
                    );


                }





                if(
                    privacyModal &&
                    privacyModal.classList.contains(
                        "active"
                    )
                ){


                    closeModal(
                        privacyModal
                    );


                }


            }
        );



    }
);

/* ==========================================================
   TRACKING — CLIQUES PARA CHECKOUT

   Cada CTA de checkout deve possuir:
   data-checkout-button
   data-checkout-position="..."
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const checkoutButtons =
            document.querySelectorAll(
                "[data-checkout-button]"
            );


        if (!checkoutButtons.length) {
            return;
        }


        checkoutButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const position =
                            button.getAttribute(
                                "data-checkout-position"
                            ) || "unknown";


                        /*
                         * MICROSOFT CLARITY
                         *
                         * Evento personalizado para localizar
                         * sessões em que houve clique no checkout.
                         */

                        if (
                            typeof clarity === "function"
                        ) {

                            clarity(
                                "event",
                                "checkout_click_" + position
                            );

                        }


                        /*
                         * GOOGLE ANALYTICS 4
                         *
                         * Evento próprio para medir intenção
                         * real de ida ao checkout.
                         */

                        if (
                            typeof gtag === "function"
                        ) {

                            gtag(
                                "event",
                                "checkout_click",
                                {
                                    checkout_position: position,
                                    value: 37.90,
                                    currency: "BRL"
                                }
                            );


                            /*
                             * GOOGLE ADS — CONVERSÃO
                             */

                            gtag(
                                "event",
                                "conversion",
                                {
                                    send_to:
                                        "AW-18379872794/tOsJCOvXo98cEJq0mrxE",

                                    value: 37.90,
                                    currency: "BRL"
                                }
                            );

                        }

                    }
                );

            }
        );

    }
);





/* ==========================================================
   CARROSSEL INFINITO — DEPOIMENTOS

   Movimento controlado 100% por JavaScript.
   Não depende de animation CSS.
========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const marquee = document.querySelector(
        "[data-testimonials-marquee]"
    );

    if (!marquee) {
        console.warn("Carrossel: marquee não encontrado.");
        return;
    }


    const track = marquee.querySelector(
        "[data-testimonials-track]"
    );

    if (!track) {
        console.warn("Carrossel: track não encontrado.");
        return;
    }


    const groups = track.querySelectorAll(
        ".testimonials-group"
    );

    if (groups.length < 2) {
        console.warn(
            "Carrossel: são necessários dois grupos."
        );
        return;
    }


    const firstGroup = groups[0];


    /* ======================================================
       CONFIGURAÇÕES
    ====================================================== */

    /*
     * Pixels por segundo.
     *
     * Desktop: 32
     * Mobile: 24
     */

    let speed =
        window.innerWidth <= 600
            ? 24
            : 32;


    let position = 0;

    let groupWidth = 0;

    let lastTimestamp = null;

    let animationFrame = null;

    let paused = false;

    let visible = true;


    /* ======================================================
       CALCULA A LARGURA EXATA DO PRIMEIRO GRUPO
    ====================================================== */

    function calculateWidth() {

        groupWidth =
            firstGroup.getBoundingClientRect().width;

    }


    /* ======================================================
       APLICA POSIÇÃO
    ====================================================== */

    function render() {

        track.style.transform =
            "translate3d(" +
            (-position) +
            "px, 0, 0)";

    }


    /* ======================================================
       LOOP PRINCIPAL
    ====================================================== */

    function animate(timestamp) {

        if (lastTimestamp === null) {
            lastTimestamp = timestamp;
        }


        /*
         * Tempo decorrido entre frames.
         */

        let delta =
            (timestamp - lastTimestamp) / 1000;


        lastTimestamp = timestamp;


        /*
         * Evita salto grande quando a aba
         * volta depois de ficar em segundo plano.
         */

        delta = Math.min(delta, 0.05);


        if (
            !paused &&
            visible &&
            groupWidth > 0
        ) {

            position += speed * delta;


            /*
             * LOOP INFINITO
             *
             * Quando percorremos exatamente
             * a largura do primeiro grupo,
             * voltamos uma largura.
             *
             * Como o segundo grupo é idêntico,
             * visualmente nada muda.
             */

            if (position >= groupWidth) {

                position =
                    position % groupWidth;

            }


            render();

        }


        animationFrame =
            requestAnimationFrame(animate);

    }


    /* ======================================================
       DESKTOP — PAUSA NO HOVER
    ====================================================== */

    const canHover =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        );


    if (canHover.matches) {

        marquee.addEventListener(
            "mouseenter",
            function () {

                paused = true;

            }
        );


        marquee.addEventListener(
            "mouseleave",
            function () {

                paused = false;

                /*
                 * Reinicia referência temporal
                 * para não causar salto.
                 */

                lastTimestamp = null;

            }
        );

    }


    /* ======================================================
       PAUSA QUANDO A ABA FICA OCULTA
    ====================================================== */

    document.addEventListener(
        "visibilitychange",
        function () {

            if (document.hidden) {

                paused = true;

            } else {

                paused = false;

                lastTimestamp = null;

            }

        }
    );


    /* ======================================================
       INTERSECTION OBSERVER
       Economiza processamento fora da tela.
    ====================================================== */

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(

                function (entries) {

                    entries.forEach(
                        function (entry) {

                            visible =
                                entry.isIntersecting;

                            lastTimestamp = null;

                        }
                    );

                },

                {
                    root: null,

                    /*
                     * Começa a mover antes
                     * de entrar totalmente na tela.
                     */

                    rootMargin:
                        "250px 0px 250px 0px",

                    threshold: 0
                }

            );


        observer.observe(marquee);

    }


    /* ======================================================
       RESIZE
    ====================================================== */

    let resizeTimer = null;


    window.addEventListener(
        "resize",
        function () {

            clearTimeout(resizeTimer);


            resizeTimer =
                setTimeout(
                    function () {

                        /*
                         * Atualiza velocidade
                         * desktop/mobile.
                         */

                        speed =
                            window.innerWidth <= 600
                                ? 24
                                : 32;


                        calculateWidth();


                        /*
                         * Mantém posição dentro
                         * do intervalo válido.
                         */

                        if (groupWidth > 0) {

                            position =
                                position % groupWidth;

                        } else {

                            position = 0;

                        }


                        render();

                        lastTimestamp = null;

                    },
                    150
                );

        },
        {
            passive: true
        }
    );


    /* ======================================================
       INICIALIZAÇÃO
    ====================================================== */

    function init() {

        calculateWidth();


        if (groupWidth <= 0) {

            /*
             * Caso raro em que o layout ainda
             * não foi calculado.
             */

            requestAnimationFrame(init);

            return;

        }


        position = 0;

        render();


        if (animationFrame === null) {

            animationFrame =
                requestAnimationFrame(animate);

        }

    }


    /*
     * requestAnimationFrame garante que o navegador
     * tenha realizado pelo menos um ciclo de layout.
     */

    requestAnimationFrame(init);

});



/* ==========================================================
   FIM DO SCRIPT.JS
========================================================== */
