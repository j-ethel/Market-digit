// Menu mobile toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling pour les liens d'ancrage
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Fermer le menu mobile si ouvert
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Animation des cartes au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer les cartes d'outils
    const toolCards = document.querySelectorAll('.tool-category-card');
    toolCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Gestion du formulaire de contact
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulation d'envoi
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            // Simulation d'un délai d'envoi
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Message envoyé !';
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                
                // Réinitialiser le formulaire
                this.reset();
                
                // Afficher un message de succès
                showNotification('Votre message a été envoyé avec succès ! Nous vous recontacterons bientôt.', 'success');
                
                // Restaurer le bouton après 3 secondes
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                }, 3000);
            }, 2000);
        });
    }

    // Fonction pour afficher les notifications
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
            type === 'success' ? 'bg-green-500 text-white' : 
            type === 'error' ? 'bg-red-500 text-white' : 
            'bg-blue-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    'fa-info-circle'
                } mr-2"></i>
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Suppression automatique après 5 secondes
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Effet de parallaxe léger pour le hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.bg-gradient-to-r');
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Validation en temps réel des champs du formulaire
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Validation selon le type de champ
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'Veuillez entrer une adresse email valide.';
                break;
            case 'tel':
                const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
                isValid = value === '' || phoneRegex.test(value);
                errorMessage = 'Veuillez entrer un numéro de téléphone valide.';
                break;
            default:
                if (field.hasAttribute('required')) {
                    isValid = value !== '';
                    errorMessage = 'Ce champ est obligatoire.';
                }
        }

        // Appliquer les styles de validation
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('success');
            removeErrorMessage(field);
        } else {
            field.classList.remove('success');
            field.classList.add('error');
            showErrorMessage(field, errorMessage);
        }

        return isValid;
    }

    function showErrorMessage(field, message) {
        removeErrorMessage(field);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message text-red-500 text-sm mt-1';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    function removeErrorMessage(field) {
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    // Compteur de caractères pour le textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const maxLength = 500;
        const counter = document.createElement('div');
        counter.className = 'text-sm text-gray-500 mt-1 text-right';
        counter.textContent = `0/${maxLength} caractères`;
        messageTextarea.parentNode.appendChild(counter);

        messageTextarea.addEventListener('input', function() {
            const length = this.value.length;
            counter.textContent = `${length}/${maxLength} caractères`;
            
            if (length > maxLength * 0.9) {
                counter.classList.add('text-orange-500');
            } else {
                counter.classList.remove('text-orange-500');
            }
            
            if (length > maxLength) {
                counter.classList.add('text-red-500');
                this.value = this.value.substring(0, maxLength);
            } else {
                counter.classList.remove('text-red-500');
            }
        });
    }
});

