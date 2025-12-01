// Mobile Navigation Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Modal Elements
const modal = document.getElementById('designModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const modalCategory = document.getElementById('modalCategory');
const modalDate = document.getElementById('modalDate');
const whatsappLink = document.getElementById('whatsappLink');
const emailLink = document.getElementById('emailLink');
const backToGallery = document.getElementById('backToGallery');
const closeBtn = document.querySelectorAll('.close-btn');

// State management
let designs = [];

// GitHub JSON URL - Using your repository
const GITHUB_JSON_URL = 'https://raw.githubusercontent.com/AdieleSolomon/Image-Gallery/main/gallery.json';

// Loading state elements
const galleryLoading = document.getElementById('galleryLoading');
const galleryError = document.getElementById('galleryError');
const galleryEmpty = document.getElementById('galleryEmpty');
const galleryContainer = document.getElementById('designGallery');
const retryLoadGallery = document.getElementById('retryLoadGallery');
const lastUpdatedDate = document.getElementById('lastUpdatedDate');
const currentYear = document.getElementById('currentYear');

// Set current year in footer
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Load gallery data from GitHub
async function loadGalleryData() {
    try {
        // Show loading state
        showLoadingState();
        
        // Fetch data from GitHub
        const response = await fetch(GITHUB_JSON_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        designs = data.designs || [];
        
        // Update last updated date in footer
        if (data.lastUpdated && lastUpdatedDate) {
            lastUpdatedDate.textContent = data.lastUpdated;
        } else if (lastUpdatedDate) {
            lastUpdatedDate.textContent = 'Recently';
        }
        
        // Render designs
        renderDesigns();
        
    } catch (error) {
        console.error('Error loading gallery:', error);
        showErrorState();
        
        // Fallback to static designs if GitHub fails
        loadFallbackDesigns();
    }
}

// Show loading state
function showLoadingState() {
    if (galleryLoading) galleryLoading.style.display = 'block';
    if (galleryError) galleryError.style.display = 'none';
    if (galleryEmpty) galleryEmpty.style.display = 'none';
    if (galleryContainer) galleryContainer.style.display = 'none';
}

// Show error state
function showErrorState() {
    if (galleryLoading) galleryLoading.style.display = 'none';
    if (galleryError) galleryError.style.display = 'block';
    if (galleryEmpty) galleryEmpty.style.display = 'none';
    if (galleryContainer) galleryContainer.style.display = 'none';
}

// Show empty state
function showEmptyState() {
    if (galleryLoading) galleryLoading.style.display = 'none';
    if (galleryError) galleryError.style.display = 'none';
    if (galleryEmpty) galleryEmpty.style.display = 'block';
    if (galleryContainer) galleryContainer.style.display = 'none';
}

// Show gallery content
function showGalleryContent() {
    if (galleryLoading) galleryLoading.style.display = 'none';
    if (galleryError) galleryError.style.display = 'none';
    if (galleryEmpty) galleryEmpty.style.display = 'none';
    if (galleryContainer) {
        galleryContainer.style.display = 'grid';
    }
}

// Render designs to the gallery
function renderDesigns() {
    if (!galleryContainer) {
        console.error('Gallery container not found!');
        return;
    }
    
    galleryContainer.innerHTML = '';
    
    if (designs.length === 0) {
        showEmptyState();
        return;
    }
    
    showGalleryContent();
    
    designs.forEach((design, index) => {
        const designCard = createDesignCard(design, index);
        galleryContainer.appendChild(designCard);
    });
}

// Create a design card element
function createDesignCard(design, index) {
    const designCard = document.createElement('div');
    designCard.className = 'design-card';
    designCard.setAttribute('data-id', design.id || index + 1);
    
    // Create image container with proper structure
    designCard.innerHTML = `
        <div class="design-img-container">
            <img src="${design.image}" 
                    alt="${design.title}" 
                    class="design-img"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'; this.alt='Image not available'">
        </div>
        <div class="design-info">
            <h3>${design.title}</h3>
            <p>${(design.description || '').substring(0, 100)}${design.description && design.description.length > 100 ? '...' : ''}</p>
            ${design.category ? `<span class="design-category">${design.category}</span>` : ''}
            ${design.date ? `<span class="design-date">${design.date}</span>` : ''}
        </div>
    `;
    
    // Add click event
    designCard.addEventListener('click', () => openDesignModal(design));
    
    return designCard;
}

// Fallback designs if GitHub fails
function loadFallbackDesigns() {
    designs = [
        {
            id: 1,
            title: "Window Blind & Curtain",
            image: "https://raw.githubusercontent.com/AdieleSolomon/Image-Gallery/main/images/design1.jpg",
            description: "Luxury window blind and curtain design for modern interiors.",
            category: "Interior Decoration",
            date: "2024-01-15"
        },
        {
            id: 2,
            title: "Window Treatment Solution",
            image: "https://raw.githubusercontent.com/AdieleSolomon/Image-Gallery/main/images/design2.jpg",
            description: "Professional window treatment solution combining blinds and curtains.",
            category: "Interior Decoration",
            date: "2024-01-15"
        },
        {
            id: 3,
            title: "Modern Curtain Installation",
            image: "https://raw.githubusercontent.com/AdieleSolomon/Image-Gallery/main/images/design3.jpg",
            description: "Modern curtain installation with custom tracks and premium fabric.",
            category: "Interior Decoration",
            date: "2024-01-15"
        }
    ];
    
    renderDesigns();
}

// Open Modal when Design Image is Clicked
function openDesignModal(design) {
    modalTitle.textContent = design.title;
    modalImage.src = design.image;
    modalImage.alt = design.title;
    modalDescription.textContent = design.description;
    
    // Set category and date if available
    if (modalCategory) {
        modalCategory.textContent = design.category || 'Interior Design';
        modalCategory.style.display = design.category ? 'inline-block' : 'none';
    }
    
    if (modalDate) {
        modalDate.textContent = design.date || '';
        modalDate.style.display = design.date ? 'inline-block' : 'none';
    }
    
    // Create WhatsApp message
    const whatsappMessage = `Hi Pure Pleasure Building and Interior Concept! I'm interested in your ${design.title} design. Please send me more information.`;
    whatsappLink.href = `https://wa.me/+234816262854?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Create Email link
    const emailSubject = `Inquiry about ${design.title} Design`;
    const emailBody = `Hello,\n\nI'm interested in your ${design.title} design. Please provide more details about this project.\n\nThank you.`;
    emailLink.href = `mailto:Abrahamuwaoma71@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add close button event listeners
if (closeBtn.length > 0) {
    closeBtn.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
}

if (backToGallery) {
    backToGallery.addEventListener('click', closeModal);
}

// Close Modal when clicking outside content
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Contact Form Submission to WhatsApp
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Create WhatsApp message
        const whatsappMessage = `Hello Pure Pleasure Building and Interior Concept!%0A%0AMy name is ${name}.%0AEmail: ${email}%0APhone: ${phone}%0A%0AMessage:%0A${message}`;
        
        // Open WhatsApp with pre-filled message
        window.open(`https://wa.me/+234816262854?text=${whatsappMessage}`, '_blank');
        
        // Show success message
        alert('Thank you for your message! You will be redirected to WhatsApp to send your inquiry.');
        
        // Reset form
        this.reset();
    });
}

// Retry loading gallery
if (retryLoadGallery) {
    retryLoadGallery.addEventListener('click', loadGalleryData);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load gallery data from GitHub
    loadGalleryData();
});

// Image error handler for modal
modalImage.onerror = function() {
    this.src = 'https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
    this.alt = 'Image not available';
};