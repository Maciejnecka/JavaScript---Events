const init = function () {
  const imagesList = document.querySelectorAll('.gallery__item');
  imagesList.forEach((img) => {
    img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
  });

  runJSSlider();
};

document.addEventListener('DOMContentLoaded', init);

const runJSSlider = function () {
  const imagesSelector = '.gallery__item';
  const sliderRootSelector = '.js-slider';

  const imagesList = document.querySelectorAll(imagesSelector);
  const sliderRootElement = document.querySelector(sliderRootSelector);

  initEvents(imagesList, sliderRootElement);
  initCustomEvents(imagesList, sliderRootElement, imagesSelector);
};

const initEvents = function (imagesList, sliderRootElement) {
  imagesList.forEach(function (item) {
    item.addEventListener('click', function (e) {
      fireCustomEvent(e.currentTarget, 'js-slider-img-click');
    });
  });
  const navNext = sliderRootElement.querySelector('.js-slider__nav--next');
  navNext.addEventListener('click', function (e) {
    fireCustomEvent(e.currentTarget, 'js-slider-img-next');
  });
  // Slider listeners
  navNext.addEventListener('mouseenter', stopImageSlider);
  navNext.addEventListener('mouseleave', startImageSlider);

  const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');
  navPrev.addEventListener('click', function (e) {
    fireCustomEvent(e.currentTarget, 'js-slider-img-prev');
  });
  // slider listeners
  navPrev.addEventListener('mouseenter', stopImageSlider);
  navPrev.addEventListener('mouseleave', startImageSlider);

  const zoom = sliderRootElement.querySelector('.js-slider__zoom');
  zoom.addEventListener('click', function (e) {
    if (e.target === zoom) {
      fireCustomEvent(e.currentTarget, 'js-slider-close');
    }
  });
};

const fireCustomEvent = function (element, name) {
  const event = new CustomEvent(name, {
    bubbles: true,
  });
  element.dispatchEvent(event);
};

const initCustomEvents = function (
  imagesList,
  sliderRootElement,
  imagesSelector
) {
  imagesList.forEach(function (img) {
    img.addEventListener('js-slider-img-click', function (event) {
      onImageClick(event, sliderRootElement, imagesSelector);
    });
  });
  sliderRootElement.addEventListener('js-slider-img-next', onImageNext);
  sliderRootElement.addEventListener('js-slider-img-prev', onImagePrev);
  sliderRootElement.addEventListener('js-slider-close', onClose);
};

const onImageClick = function (event, sliderRootElement, imagesSelector) {
  sliderRootElement.classList.add('js-slider--active');
  const sliderImage = sliderRootElement.querySelector('.js-slider__image');
  const clickedImage = event.currentTarget;
  setImageSource(sliderImage, clickedImage);
  const groupName = event.currentTarget.dataset.sliderGroupName;
  const groupAllImages = document.querySelectorAll(
    `${imagesSelector}[data-slider-group-name=${groupName}]`
  );
  const thumbsContainer = sliderRootElement.querySelector('.js-slider__thumbs');

  groupAllImages.forEach(function (el) {
    if (el.dataset.sliderGroupName === groupName) {
      const thumbImg = createThumbnailImage(
        el.firstElementChild.getAttribute('src')
      );
      thumbsContainer.appendChild(thumbImg);
      const currentImg = sliderRootElement.querySelector('.js-slider__image');
      if (
        el.firstElementChild.getAttribute('src') ===
        currentImg.getAttribute('src')
      ) {
        thumbImg.classList.add('js-slider__thumbs-image--current');
      }
    }
  });
  startImageSlider();
};

const onImageNext = function () {
  const currentImg = document.querySelector(
    '.js-slider__thumbs-image--current'
  );
  const nextEle = currentImg.parentElement.nextElementSibling;
  const parentElement = document.querySelector('.js-slider__thumbs');
  const firstChild = parentElement.firstElementChild;
  const firstPicture = firstChild.nextElementSibling;
  if (!nextEle) {
    setThumbsImageAsCurrent(firstPicture.firstElementChild);
  } else {
    const nextImg = nextEle.firstElementChild;
    setThumbsImageAsCurrent(nextImg);
  }
};

const onImagePrev = function () {
  const currentImg = this.querySelector('.js-slider__thumbs-image--current');
  const prevImg = findPreviousImage(currentImg);
  if (prevImg) {
    setThumbsImageAsCurrent(prevImg);
  }
};

const onClose = function () {
  const sliderElement = document.querySelector('.js-slider');
  sliderElement.classList.remove('js-slider--active');
  removeThumbs();
  stopImageSlider();
};

// //////////////////////////////////////////////////////////
// Functions
// Onclick image function
function setImageSource(targetImageElement, sourceElement) {
  const imageSrc = sourceElement.firstElementChild.getAttribute('src');
  targetImageElement.setAttribute('src', imageSrc);
}

// Onclick create thumbnail
function createThumbnailImage(src) {
  const thumbItem = document.createElement('figure');
  const thumbImg = document.createElement('img');

  thumbItem.classList.add('js-slider__thumbs-item');
  thumbImg.classList.add('js-slider__thumbs-image');
  thumbImg.setAttribute('src', src);

  thumbItem.appendChild(thumbImg);
  return thumbItem;
}
//OnImageNext function
function setThumbsImageAsCurrent(imageElement) {
  const currentImg = document.querySelector(
    '.js-slider__thumbs-image--current'
  );
  if (currentImg) {
    currentImg.classList.remove('js-slider__thumbs-image--current');
  }
  imageElement.classList.add('js-slider__thumbs-image--current');
  const nextImageSrc = imageElement.getAttribute('src');
  document.querySelector('.js-slider__image').setAttribute('src', nextImageSrc);
}
//OnImagePrev function
function findPreviousImage(currentImg) {
  let prevImg = currentImg.parentElement.previousElementSibling;
  while (
    prevImg !== null &&
    prevImg.classList.contains('js-slider__thumbs-item--prototype')
  ) {
    prevImg = prevImg.previousElementSibling;
  }
  if (prevImg === null) {
    const thumbs = document.querySelectorAll('.js-slider__thumbs-item');
    prevImg = thumbs[thumbs.length - 1];
  }
  return prevImg ? prevImg.firstElementChild : null;
}
//onClose function
function removeThumbs() {
  const thumbsContainer = document.querySelector('.js-slider__thumbs');
  const sliderItems = document.querySelectorAll('.js-slider__thumbs-item');
  sliderItems.forEach(function (ele) {
    if (!ele.classList.contains('js-slider__thumbs-item--prototype')) {
      thumbsContainer.removeChild(ele);
    }
  });
}

let sliderInterval;

function startImageSlider() {
  clearInterval(sliderInterval);
  sliderInterval = setInterval(onImageNext, 2500);
}

function stopImageSlider() {
  clearInterval(sliderInterval);
}
