'use strict';
//////////////////////////////////////////////////////////////////////////////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('header');
////////////////////////////////////////////////////////////////////////////////////////////// 
// Creating and inserting elements
const message = document.createElement('div');
// Styles, attributes and classes
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
message.style.padding = '20px';
message.classList.add('cookie-message');
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';
header.append(message);
// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', () => {
  message.remove();
});
//////////////////////////////////////////////////////////////////////////////////////////////
// Open modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
//////////////////////////////////////////////////////////////////////////////////////////////
// Close modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
//////////////////////////////////////////////////////////////////////////////////////////////
// Open modal event handler
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// Close modal event handler
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
//////////////////////////////////////////////////////////////////////////////////////////////
// Escape modal keydown event handler
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////
// Page navigation
// Button scrollTo
btnScrollTo.addEventListener('click', (e) => {
  const s1Cords = section1.getBoundingClientRect();
  section1.scrollIntoView({behavior: 'smooth'});
});
//////////////////////////////////////////////////////////////////////////////////////////////
// Event delegation
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  // Matching strategy, to ignore clicks that dont happen directly on a link in the nav bar
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  };
});

// Event delegation
tabsContainer.addEventListener('click', function(e) {
  e.preventDefault();
  // select the elements closest relative with a class of .operations__tab
  const clicked = e.target.closest('.operations__tab');
  // handle a null event target (if click event was null) 
  if (!clicked) return;
  // remove active class from each tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  // add active class to the clicked tab
  clicked.classList.add('operations__tab--active');
  // select data-tab attribute from event target (clicked)
  const id = clicked.getAttribute('data-tab');
  // dynamically select the corresponding content using the id
  const content = document.querySelector(`.operations__content--${id}`);
  // remove active class from each content
  tabsContent.forEach(content => content.classList.remove('operations__content--active'));
  // add active class to selected content
  content.classList.add('operations__content--active');
});
//////////////////////////////////////////////////////////////////////////////////////////////
// Menu fade animation
const handleHover = function(e) {
  
  if (e.target.classList.contains('nav__link')) {
    const clicked = e.target;
    const siblings = clicked.closest('.nav').querySelectorAll('.nav__link');
    const logo = clicked.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== clicked) el.style.opacity = this;
    });
    logo.style.opacity = this;
  };
};
// Passing argument into handler function
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
//////////////////////////////////////////////////////////////////////////////////////////////
// Sticky nav bar
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  };
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);
//////////////////////////////////////////////////////////////////////////////////////////////
// Revealing elements on scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, sectionObserver) {
  entries.forEach(entry => {
    // gaurd clause
    if (!entry.isIntersecting) return;
    
    entry.target.classList.remove('section--hidden');
    sectionObserver.unobserve(entry.target);
  }); 
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden')
});
//////////////////////////////////////////////////////////////////////////////////////////////
// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, imageObserver) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });
  imageObserver.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

imgTargets.forEach(img => imageObserver.observe(img));
//////////////////////////////////////////////////////////////////////////////////////////////
// Slider component
const slider = function() {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const maxSlide = slides.length;
  const dotContainer = document.querySelector('.dots');

  // Functions
  const gotoSlide = function(slide) {
    slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
  };

  // Next slide
  const nextSlide = function() {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  // Prev slide
  const prevSlide = function() {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    gotoSlide(curSlide);
    activateDot(curSlide);
  };

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // keyboard events
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Crate dots
  const createDots = function() {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };

  // Activate dots
  const activateDot = function(slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };

  // Dot click functionality
  dotContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('dots__dot')) {
      curSlide = Number(e.target.dataset.slide);
      gotoSlide(curSlide);
      activateDot(curSlide);
    };
  });

  // Init slide functionality
  const init = function() {
    gotoSlide(0);
    createDots();
    activateDot(0);
  };
  init();
};
slider();


//////////////////////////////////////////////////////////////////////////////////////////////
// DOM traversing
// const h1 = document.querySelector('h1');
// Going downward
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.children);
// Upwards
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('header').style.background = 'var(--gradient-primary)';
// h1.closest('h1').style.background = 'var(--gradient-secondary)';

// sideways
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.previousSibling);
// console.log(h1.nextSibling);
// console.log(h1.parentElement.children);





////////////////////////////////////////////
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);



// console.log(allSections);

// document.getElementById('section--1');

// const allBtns = document.getElementsByTagName('button');
// console.log(allBtns);

// console.log(document.getElementsByClassName('btn'));



// before() inserts before element as a sibling & after() inserts after element as a sibling
// header.before(message);
// header.after(message);

// setting custom properties
// document.documentElement.style.setProperty('--color-primary', 'orange');

// Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);

// console.log(logo.className);

// Set attributes
// logo.alt = 'Minimalist Logo';

// console.log(logo.alt);
// setAttribute()
// logo.setAttribute('designer', '@hiddenciphers');
// getAttribute()
// console.log(logo.getAttribute('designer'));

// console.log(logo.src); // absolute path
// console.log(logo.getAttribute('src')); // relative path

// const link = document.querySelector('.twitter-link');
// console.log(link.href);

// Data attributes
// console.log(logo.dataset.versionNumber);

// Classes
// logo.classList.add('');
// logo.classList.remove('');
// logo.classList.toggle('');
// logo.classList.contains(''); // includes
// Dont use className

 

// Events
// const h1 = document.querySelector('h1');

// const alertH1 = (e) => {
//   alert('addEventListener: Great! You are reading the heading!');
//   h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1);

 

// h1.onmouseenter = (e) => {
//   alert('addEventListener: Great! You are reading the heading!');
// };

// Event propagation, bubbling and capturing
// const randomInt = (min,max) => Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function(e) {
//   console.log('LINK', e.target);
//   this.style.backgroundColor = randomColor();
//   // stop propagation
//   e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function(e) {
//   console.log('LINKS', e.target);
//   this.style.backgroundColor = randomColor();
//   e.stopPropagation();
// });

// document.querySelector('.nav').addEventListener('click', function(e) {
//   console.log('NAV', e.target);
//   this.style.backgroundColor = randomColor();
// });

// Event delegation

// document.addEventListener('DOMContentLoaded', function(e) {
//   console.log('HTML parsed and DOM tree built', e);
// });

// window.addEventListener('load', function(e) {
//   console.log('Page fully loaded', e);
// });

// window.addEventListener('beforeunload', function(e) {
//   e.preventDefault();
//   console.log(e);
  
// });

