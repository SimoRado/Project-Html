// Variables globales
let menu, sidebar, video, pause_play, closeBtn;

// Fonction globale pour ouvrir le menu (accessible depuis HTML)
function openMenu() {
    const menuElement = document.getElementById("menu");
    const videoElement = document.getElementById("bg-video");
    
    if (menuElement) {
        console.log("Ouverture du menu");
        // Forcer l'affichage avec !important via setProperty
        menuElement.style.setProperty('display', 'flex', 'important');
        menuElement.style.setProperty('visibility', 'visible', 'important');
        menuElement.style.setProperty('opacity', '1', 'important');
        menuElement.style.setProperty('left', '0', 'important');
        menuElement.style.setProperty('z-index', '99999', 'important');
        menuElement.classList.add('menu-open');
        
        if (videoElement) {
            videoElement.style.animation = "blurit 0.5s ease";
            videoElement.style.filter = "blur(20px)";
        }
    } else {
        console.error("Menu element non trouvé!");
    }
}

// Fonction globale pour fermer le menu
function closeMenu() {
    const menuElement = document.getElementById("menu");
    const videoElement = document.getElementById("bg-video");
    
    if (menuElement) {
        console.log("Fermeture du menu");
        menuElement.style.setProperty('left', '-500px', 'important');
        menuElement.classList.remove('menu-open');
        
        if (videoElement) {
            videoElement.style.animation = "unblur 0.5s ease";
            videoElement.style.filter = "blur(0px)";
        }
    }
}

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", function() {
    menu = document.getElementById("menu-logo");
    sidebar = document.getElementById("menu");
    video = document.getElementById("bg-video");
    pause_play = document.getElementById("pause-play");
    closeBtn = document.getElementById("close-btn");

    // Vérifier que les éléments existent
    if (!menu) {
        console.error("menu-logo non trouvé");
    }
    if (!sidebar) {
        console.error("menu non trouvé");
    }
    if (!closeBtn) {
        console.error("close-btn non trouvé");
    }

    if (!menu || !sidebar || !closeBtn) {
        console.error("Éléments du menu non trouvés");
        return;
    }

    console.log("Menu initialisé avec succès");

    // Fermer le menu
    closeBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        closeMenu();
    });

    // Ouvrir le menu
    menu.addEventListener("click", function(e) {
        e.stopPropagation();
        openMenu();
    });

    // Empêcher la fermeture en cliquant sur le menu lui-même
    sidebar.addEventListener("click", function(e) {
        e.stopPropagation();
    });

    // Fermer le menu en cliquant en dehors
    document.addEventListener("click", function(e) {
        if (sidebar && sidebar.style.left === "0px" || sidebar && sidebar.style.left === "0") {
            if (!sidebar.contains(e.target) && !menu.contains(e.target)) {
                sidebar.style.left = "-500px";
                sidebar.style.animation = "close 0.4s ease";
                if (video) {
                    video.style.animation = "unblur 0.5s ease";
                    video.style.filter = "blur(0px)";
                }
            }
        }
    });
});

function pausePlayVideo(){
    if (!video || !pause_play) {
        video = document.getElementById("bg-video");
        pause_play = document.getElementById("pause-play");
    }
    
    if (video && pause_play) {
        if (video.paused) {
            video.play();
            pause_play.src = "../assets/pause.png";
        } else {
            video.pause();
            pause_play.src = "../assets/play.png";
        }
    }
}

function afficherContact() {
    let contactSection = document.getElementById("contact");
    if (contactSection) {
        if (contactSection.style.display === "none" || contactSection.style.display === "") {
            contactSection.style.display = "block";
        } else {
            contactSection.style.display = "none";
        }
    }
}