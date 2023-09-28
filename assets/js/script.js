const init = function () {
  const imagesList = document.querySelectorAll('.gallery__item');
  imagesList.forEach((img) => {
    img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
  }); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

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

  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
  // na elemencie [.js-slider__nav--next]
  const navNext = sliderRootElement.querySelector('.js-slider__nav--next');
  navNext.addEventListener('click', function (e) {
    fireCustomEvent(e.currentTarget, 'js-slider-img-next');
  });
  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
  // na elemencie [.js-slider__nav--prev]
  const navPrev = sliderRootElement.querySelector('.js-slider__nav--prev');
  navPrev.addEventListener('click', function (e) {
    fireCustomEvent(e.currentTarget, 'js-slider-img-prev');
  });
  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
  // tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
  const zoom = sliderRootElement.querySelector('.js-slider__zoom');
  zoom.addEventListener('click', function (e) {
    if (e.target === zoom) {
      fireCustomEvent(e.currentTarget, 'js-slider-close');
    }
  });
};

const fireCustomEvent = function (element, name) {
  console.log(element.className, '=>', name);

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
  // todo:
  // 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
  sliderRootElement.classList.add('js-slider--active');

  // 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
  const sliderImage = sliderRootElement.querySelector('.js-slider__image');
  const imageSrc = event.currentTarget.firstElementChild.getAttribute('src');
  sliderImage.setAttribute('src', imageSrc);
  // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
  const groupName = event.currentTarget.dataset.sliderGroupName;
  // 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
  const groupAllImages = document.querySelectorAll(
    `${imagesSelector}[data-slider-group-name=${groupName}]`
  );
  // 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
  const thumbsContainer = sliderRootElement.querySelector('.js-slider__thumbs');

  groupAllImages.forEach(function (el) {
    if (el.dataset.sliderGroupName === groupName) {
      const thumbItem = document.createElement('figure');
      const thumbImg = document.createElement('img');
      const imgSrc = el.firstElementChild.getAttribute('src');
      thumbItem.classList.add('js-slider__thumbs-item');
      thumbImg.classList.add('js-slider__thumbs-image');
      thumbImg.setAttribute('src', imgSrc);
      thumbItem.appendChild(thumbImg);
      thumbsContainer.appendChild(thumbItem);

      // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany
      const currentImg = sliderRootElement.querySelector('.js-slider__image');
      if (
        el.firstElementChild.getAttribute('src') ===
        currentImg.getAttribute('src')
      ) {
        thumbImg.classList.add('js-slider__thumbs-image--current');
      }
    }
  });
  slider = setInterval(onImageNext, 5000);
};

const onImageNext = function (e) {
  console.log(this, 'onImageNext');
  // [this] wskazuje na element [.js-slider]

  // todo:
  // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
  const currentImg = document.querySelector(
    '.js-slider__thumbs-image--current'
  );
  // 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
  const nextEle = currentImg.parentElement.nextElementSibling;
  const parentElement = document.querySelector('.js-slider__thumbs');
  const firstChild = parentElement.firstElementChild;
  const firstPicture = firstChild.nextElementSibling;
  // 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
  if (!nextEle) {
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    currentImg.classList.remove('js-slider__thumbs-image--current');
    firstPicture.firstElementChild.classList.add(
      'js-slider__thumbs-image--current'
    );
    // 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]
    const firstImgSrc = firstPicture.firstElementChild.getAttribute('src');
    document
      .querySelector('.js-slider__image')
      .setAttribute('src', firstImgSrc);
  } else {
    const nextImg = nextEle.firstElementChild;
    currentImg.classList.remove('js-slider__thumbs-image--current');
    nextImg.classList.add('js-slider__thumbs-image--current');
    const nextImageSrc = nextImg.getAttribute('src');
    document
      .querySelector('.js-slider__image')
      .setAttribute('src', nextImageSrc);
  }
};

const onImagePrev = function () {
  console.log(this, 'onImagePrev');
  // [this] wskazuje na element [.js-slider]
  // todo:
  // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
  const currentImg = this.querySelector('.js-slider__thumbs-image--current');
  // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
  let prevImg = currentImg.parentElement.previousElementSibling;
  // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
  while (
    prevImg !== null &&
    prevImg.classList.contains('js-slider__thumbs-item--prototype')
  ) {
    prevImg = prevImg.previousElementSibling;
  }
  if (prevImg === null) {
    const thumbs = this.querySelectorAll('.js-slider__thumbs-item');
    prevImg = thumbs[thumbs.length - 1];
  }
  if (prevImg !== null) {
    // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
    currentImg.classList.remove('js-slider__thumbs-image--current');
    prevImg.firstElementChild.classList.add('js-slider__thumbs-image--current');
    // 5. podmienić atrybut [src] dla [.js-slider__image]
    const mainImg = this.querySelector('.js-slider__image');
    const prevImageSrc = prevImg.firstElementChild.getAttribute('src');
    mainImg.setAttribute('src', prevImageSrc);
  }
};

const onClose = function () {
  // todo:
  // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
  const sliderElement = document.querySelector('.js-slider');
  sliderElement.classList.remove('js-slider--active');
  // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
  const thumbsContainer = document.querySelector('.js-slider__thumbs');
  const sliderItems = document.querySelectorAll('.js-slider__thumbs-item');
  sliderItems.forEach(function (ele) {
    if (!ele.classList.contains('js-slider__thumbs-item--prototype')) {
      thumbsContainer.removeChild(ele);
    }
  });
  clearInterval(slider);
};
