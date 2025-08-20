// Professional Flight Price Predictor - Advanced JavaScript
// Author: AI Flight Price Predictor System
// Version: 2.0.0 - Interview Ready

class FlightPricePredictorApp {
    constructor() {
        this.form = null;
        this.submitButton = null;
        this.inputs = [];
        this.isSubmitting = false;
        this.validationRules = {};
        
        this.init();
    }

    // Initialize the application
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.setupEventListeners();
            this.setupValidation();
            this.setupAnimations();
            this.handleExistingResults();
            this.setupAccessibility();
            
            console.log('✈️ Flight Price Predictor initialized successfully');
        });
    }

    // Setup DOM elements
    setupElements() {
        this.form = document.querySelector('.prediction-form');
        this.submitButton = document.querySelector('.predict-btn');
        this.inputs = document.querySelectorAll('input, select');
        this.container = document.querySelector('.container');
        
        if (!this.form || !this.submitButton) {
            console.error('Required elements not found');
            return;
        }
    }

    // Setup all event listeners
    setupEventListeners() {
        // Form submission with enhanced loading state
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Real-time input validation
        this.inputs.forEach(input => {
            input.addEventListener('input', (e) => this.handleInputChange(e));
            input.addEventListener('blur', (e) => this.handleInputBlur(e));
            input.addEventListener('focus', (e) => this.handleInputFocus(e));
        });

        // Special validation for city selection
        this.setupCityValidation();
        
        // Keyboard navigation improvements
        this.setupKeyboardNavigation();
        
        // Dynamic form section expansion
        this.setupFormSectionAnimations();
    }

    // Enhanced form submission handler
    handleFormSubmit(event) {
        if (this.isSubmitting) {
            event.preventDefault();
            return;
        }

        // Validate form before submission
        if (!this.validateForm()) {
            event.preventDefault();
            this.showValidationErrors();
            return;
        }

        this.isSubmitting = true;
        this.showLoadingState();
        this.logFormData();
    }

    // Show enhanced loading state
    showLoadingState() {
        const buttonText = this.submitButton.querySelector('span');
        const loadingSpinner = this.submitButton.querySelector('.loading-spinner');
        
        if (buttonText) buttonText.textContent = 'Analyzing Flight Data...';
        if (loadingSpinner) loadingSpinner.style.display = 'block';
        
        this.submitButton.classList.add('loading');
        this.submitButton.disabled = true;
        
        // Add pulsing animation to form
        this.container.style.animation = 'pulse 2s ease-in-out infinite';
        
        // Simulate progress updates
        this.showProgressUpdates();
    }

    // Show progress updates during prediction
    showProgressUpdates() {
        const messages = [
            'Processing flight data...',
            'Analyzing market trends...',
            'Calculating optimal price...',
            'Finalizing prediction...'
        ];
        
        let currentMessage = 0;
        const buttonText = this.submitButton.querySelector('span');
        
        const progressInterval = setInterval(() => {
            if (currentMessage < messages.length && buttonText) {
                buttonText.textContent = messages[currentMessage];
                currentMessage++;
            } else {
                clearInterval(progressInterval);
            }
        }, 800);
    }

    // Handle input changes with real-time feedback
    handleInputChange(event) {
        const input = event.target;
        this.clearInputError(input);
        
        // Real-time validation for specific fields
        if (input.type === 'number') {
            this.validateNumberInput(input);
        }
        
        this.updateFormProgress();
    }

    // Handle input blur with validation
    handleInputBlur(event) {
        const input = event.target;
        this.validateInput(input);
        this.addInputAnimation(input);
    }

    // Handle input focus
    handleInputFocus(event) {
        const input = event.target;
        this.clearInputError(input);
        this.addFocusAnimation(input);
    }

    // Validate individual input
    validateInput(input) {
        const isValid = input.checkValidity() && input.value.trim() !== '';
        
        if (isValid) {
            this.markInputValid(input);
        } else {
            this.markInputInvalid(input);
        }
        
        // Special validations
        if (input.name === 'days_left') {
            this.validateDaysLeft(input);
        } else if (input.name === 'duration') {
            this.validateDuration(input);
        }
        
        return isValid;
    }

    // Mark input as valid
    markInputValid(input) {
        input.style.borderColor = '#28a745';
        input.style.background = 'linear-gradient(135deg, rgba(40, 167, 69, 0.05), rgba(40, 167, 69, 0.1))';
        
        // Add success icon
        this.addValidationIcon(input, 'fas fa-check-circle', '#28a745');
    }

    // Mark input as invalid
    markInputInvalid(input) {
        input.style.borderColor = '#dc3545';
        input.style.background = 'linear-gradient(135deg, rgba(220, 53, 69, 0.05), rgba(220, 53, 69, 0.1))';
        
        // Add error icon
        this.addValidationIcon(input, 'fas fa-exclamation-circle', '#dc3545');
        
        // Add shake animation
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => input.style.animation = '', 500);
    }

    // Add validation icon to input
    addValidationIcon(input, iconClass, color) {
        // Remove existing icon
        const existingIcon = input.parentNode.querySelector('.validation-icon');
        if (existingIcon) existingIcon.remove();
        
        // Create new icon
        const icon = document.createElement('i');
        icon.className = `${iconClass} validation-icon`;
        icon.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: ${color};
            font-size: 16px;
            pointer-events: none;
            z-index: 10;
        `;
        
        // Make parent relative if not already
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(icon);
    }

    // Clear input error state
    clearInputError(input) {
        input.style.borderColor = '#e2e8f0';
        input.style.background = 'rgba(255, 255, 255, 0.9)';
        
        const icon = input.parentNode.querySelector('.validation-icon');
        if (icon) icon.remove();
    }

    // Setup city validation (source !== destination)
    setupCityValidation() {
        const sourceSelect = document.querySelector('[name="source"]');
        const destSelect = document.querySelector('[name="dest"]');
        
        if (!sourceSelect || !destSelect) return;
        
        const validateCities = () => {
            const sourceValue = sourceSelect.value;
            const destValue = destSelect.value;
            
            if (sourceValue && destValue) {
                if (sourceValue === destValue) {
                    this.showCityError(destSelect, 'Destination must be different from source city');
                    return false;
                } else {
                    this.clearCityError(destSelect);
                    // Add route visualization
                    this.showRoutePreview(sourceValue, destValue);
                    return true;
                }
            }
            return true;
        };
        
        sourceSelect.addEventListener('change', validateCities);
        destSelect.addEventListener('change', validateCities);
    }

    // Show city validation error
    showCityError(input, message) {
        input.setCustomValidity(message);
        this.markInputInvalid(input);
        
        // Show tooltip
        this.showTooltip(input, message, 'error');
    }

    // Clear city validation error
    clearCityError(input) {
        input.setCustomValidity('');
        this.clearInputError(input);
        this.hideTooltip(input);
    }

    // Show route preview
    showRoutePreview(source, dest) {
        const routePreview = document.createElement('div');
        routePreview.className = 'route-preview';
        routePreview.innerHTML = `
            <div style="
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
                padding: 10px 15px;
                border-radius: 8px;
                margin-top: 10px;
                border: 1px solid rgba(102, 126, 234, 0.2);
                animation: fadeInUp 0.3s ease;
            ">
                <i class="fas fa-route" style="color: #667eea; margin-right: 8px;"></i>
                <strong>${source}</strong> 
                <i class="fas fa-arrow-right" style="margin: 0 8px; color: #667eea;"></i> 
                <strong>${dest}</strong>
            </div>
        `;
        
        // Remove existing preview
        const existingPreview = document.querySelector('.route-preview');
        if (existingPreview) existingPreview.remove();
        
        // Add new preview
        const destGroup = document.querySelector('[name="dest"]').closest('.form-group');
        destGroup.appendChild(routePreview);
    }

    // Validate number inputs with range checking
    validateNumberInput(input) {
        const value = parseInt(input.value);
        const min = parseInt(input.min);
        const max = parseInt(input.max);
        
        if (input.name === 'days_left') {
            this.validateDaysLeft(input);
        } else if (input.name === 'duration') {
            this.validateDuration(input);
        }
    }

    // Validate days left with smart suggestions
    validateDaysLeft(input) {
        const days = parseInt(input.value);
        let message = '';
        let type = 'info';
        
        if (days < 7) {
            message = '🔥 Last minute booking - prices may be higher';
            type = 'warning';
        } else if (days > 60) {
            message = '💡 Early bird booking - great for savings!';
            type = 'success';
        } else if (days >= 15 && days <= 30) {
            message = '✨ Optimal booking window for best prices';
            type = 'success';
        }
        
        if (message) {
            this.showTooltip(input, message, type);
        }
    }

    // Validate flight duration
    validateDuration(input) {
        const duration = parseInt(input.value);
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        
        if (duration > 0) {
            const message = `Flight time: ${hours}h ${minutes}m`;
            this.showTooltip(input, message, 'info');
        }
    }

    // Show tooltip with message
    showTooltip(element, message, type) {
        this.hideTooltip(element);
        
        const tooltip = document.createElement('div');
        tooltip.className = `tooltip tooltip-${type}`;
        tooltip.innerHTML = message;
        tooltip.style.cssText = `
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : type === 'success' ? '#28a745' : '#17a2b8'};
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 1000;
            margin-top: 5px;
            opacity: 0;
            animation: fadeInUp 0.3s ease forwards;
            max-width: 200px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        // Add arrow
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            top: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 5px solid ${tooltip.style.background};
        `;
        tooltip.appendChild(arrow);
        
        element.parentNode.style.position = 'relative';
        element.parentNode.appendChild(tooltip);
        
        // Auto hide after 3 seconds for info tooltips
        if (type === 'info' || type === 'success') {
            setTimeout(() => this.hideTooltip(element), 3000);
        }
    }

    // Hide tooltip
    hideTooltip(element) {
        const tooltip = element.parentNode.querySelector('.tooltip');
        if (tooltip) {
            tooltip.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => tooltip.remove(), 300);
        }
    }

    // Update form completion progress
    updateFormProgress() {
        const totalInputs = this.inputs.length;
        const completedInputs = Array.from(this.inputs).filter(input => 
            input.value.trim() !== '' && input.checkValidity()
        ).length;
        
        const progress = Math.round((completedInputs / totalInputs) * 100);
        
        // Update progress indicator
        this.updateProgressIndicator(progress);
        
        // Enable/disable submit button based on completion
        if (progress === 100) {
            this.submitButton.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            this.submitButton.style.transform = 'scale(1.02)';
        } else {
            this.submitButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            this.submitButton.style.transform = 'scale(1)';
        }
    }

    // Update progress indicator
    updateProgressIndicator(progress) {
        let progressBar = document.querySelector('.form-progress');
        
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'form-progress';
            progressBar.innerHTML = `
                <div class="progress-bar-container">
                    <div class="progress-bar"></div>
                    <span class="progress-text">0% Complete</span>
                </div>
            `;
            progressBar.style.cssText = `
                margin: 20px 0;
                text-align: center;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                .progress-bar-container {
                    position: relative;
                    background: rgba(226, 232, 240, 0.5);
                    height: 6px;
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 8px;
                }
                .progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #667eea, #764ba2);
                    border-radius: 3px;
                    transition: width 0.3s ease;
                    width: 0%;
                }
                .progress-text {
                    font-size: 12px;
                    color: #667eea;
                    font-weight: 500;
                }
            `;
            document.head.appendChild(style);
            
            this.form.insertBefore(progressBar, this.submitButton);
        }
        
        const bar = progressBar.querySelector('.progress-bar');
        const text = progressBar.querySelector('.progress-text');
        
        bar.style.width = `${progress}%`;
        text.textContent = `${progress}% Complete`;
        
        if (progress === 100) {
            text.innerHTML = '<i class="fas fa-check"></i> Ready to predict!';
            text.style.color = '#28a745';
        }
    }

    // Validate entire form
    validateForm() {
        let isValid = true;
        const errors = [];
        
        this.inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
                errors.push(`${input.name}: ${input.validationMessage || 'Invalid input'}`);
            }
        });
        
        return isValid;
    }

    // Show validation errors
    showValidationErrors() {
        // Scroll to first invalid input
        const firstInvalid = this.form.querySelector('input:invalid, select:invalid');
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            firstInvalid.focus();
        }
        
        // Show error notification
        this.showNotification('Please fill in all required fields correctly', 'error');
    }

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        this.inputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && input.tagName === 'SELECT') {
                    e.preventDefault();
                    const nextInput = this.inputs[index + 1];
                    if (nextInput) {
                        nextInput.focus();
                    } else {
                        this.submitButton.focus();
                    }
                }
            });
        });
    }

    // Setup form section animations
    setupFormSectionAnimations() {
        const sections = document.querySelectorAll('.form-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                }
            });
        }, { threshold: 0.1 });
        
        sections.forEach(section => observer.observe(section));
    }

    // Setup animations
    setupAnimations() {
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-10px); }
            }
            @keyframes slideInUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Handle existing results
    handleExistingResults() {
        const resultContainer = document.querySelector('.result-container');
        if (resultContainer) {
            // Scroll to result
            setTimeout(() => {
                resultContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 500);
            
            // Add enhanced animations
            resultContainer.style.animation = 'slideInUp 0.8s ease forwards';
            
            // Add confetti effect for successful predictions
            if (resultContainer.classList.contains('success')) {
                this.showConfetti();
            }
        }
    }

    // Show confetti animation
    showConfetti() {
        const colors = ['#667eea', '#764ba2', '#4facfe', '#00f2fe'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 6px;
                    height: 6px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    z-index: 9999;
                    border-radius: 50%;
                    pointer-events: none;
                    animation: confetti-fall 3s linear forwards;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
    }

    // Setup accessibility features
    setupAccessibility() {
        // Add ARIA labels and roles
        this.inputs.forEach(input => {
            const label = input.closest('.form-group').querySelector('label');
            if (label && !input.getAttribute('aria-label')) {
                input.setAttribute('aria-label', label.textContent.trim());
            }
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                if (this.validateForm()) {
                    this.form.submit();
                }
            }
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease forwards;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add input focus animation
    addFocusAnimation(input) {
        input.style.transform = 'translateY(-1px)';
        input.style.transition = 'all 0.2s ease';
    }

    // Add input animation
    addInputAnimation(input) {
        input.style.transform = 'translateY(0)';
    }

    // Log form data for debugging
    logFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        console.log('📊 Form Data Submitted:', data);
        console.log('🚀 Processing flight price prediction...');
    }
}

// Initialize the application
const flightPredictorApp = new FlightPricePredictorApp();

// Add additional utility functions
const Utils = {
    // Format price display
    formatPrice: (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
    },
    
    // Format duration
    formatDuration: (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    },
    
    // Get airline emoji
    getAirlineEmoji: (airline) => {
        const emojis = {
            'IndiGo': '✈️',
            'Air India': '🇮🇳',
            'SpiceJet': '🌶️',
            'Vistara': '⭐',
            'GO FIRST': '🚀',
            'AirAsia': '🔴'
        };
        return emojis[airline] || '✈️';
    }
};

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FlightPricePredictorApp, Utils };
}

console.log('✅ Professional Flight Price Predictor Script Loaded Successfully');