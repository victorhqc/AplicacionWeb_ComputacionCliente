(function(app) {
  function Gallery(target) {
    this._setInstance(target);

    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);

    this.activePicture = 0;
    this.json = [];
  }

  Gallery.prototype.init = function init() {
    this._fetchJSON()
      .then(() => {
        this.buildControls();
        this.buildPictures();
      });
  };

  Gallery.prototype._setInstance = function _setInstance(target) {
    this.target = target;
    this.instance = document.querySelector(target);

    if (!this.instance) {
      throw new Error(
        `No se puede inicializar la galería con: ${target}, revisa que sea correcto.`
      );
    }

    this.instance.className = 'gallery';
  };

  Gallery.prototype._fetchJSON = function _fetchJSON() {
    return new Promise((resolve, reject) => {
      const request = new Request('pictures.json');

      fetch(request)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Can't fetch pictures json. Did you build the project?");
          }

          return response.json();
        })
        .then((json) => {
          this.picturesLength = json.length;

          this.json = json;
          resolve(json);
        })
        .catch(reject);
    });
  };

  Gallery.prototype._clearElements = function _clearElements(target) {
    const pictures = document.querySelectorAll(target);
    pictures.forEach((picture) => {
      picture.parentNode.removeChild(picture);
    });
  };

  Gallery.prototype.buildPictures = function buildPictures() {
    if (!this.json) {
      return;
    }

    this._clearElements('.gallery__picture');

    this.json.forEach((picture) => {
      const element = document.createElement('div');
      element.className = 'gallery__picture';
      element.style.backgroundImage = `url(/pictures/${picture.id}.jpg)`;

      this.instance.appendChild(element);
    });

    this._setActivePicture();
  };

  Gallery.prototype.buildControls = function buildControls() {
    this._clearElements('.gallery__control');

    const buildControl = (name) => {
      const elm = document.createElement('div');
      elm.classList.add('gallery__control');
      elm.classList.add(`gallery__control--${name}`);
      this.instance.appendChild(elm);

      return elm;
    };

    const prev = buildControl('previous');
    const next = buildControl('next');

    prev.addEventListener('click', this.previous, false);
    next.addEventListener('click', this.next, false);
  };

  Gallery.prototype.next = function next() {
    if (this.activePicture === this.json.length - 1) {
      this.activePicture = 0;
    } else {
      this.activePicture += 1;
    }

    this._setActivePicture();
  };

  Gallery.prototype.previous = function previous() {
    if (this.activePicture === 0) {
      this.activePicture = this.json.length - 1;
    } else {
      this.activePicture -= 1;
    }

    this._setActivePicture();
  };

  Gallery.prototype._setActivePicture = function _setActivePicture() {
    const currentActivePicture = document.querySelector('.gallery__picture--active');
    if (currentActivePicture) {
      currentActivePicture.classList.remove('gallery__picture--active');
    }

    const picture = document.querySelectorAll('.gallery__picture')[this.activePicture];
    picture.classList.add('gallery__picture--active');
  };

  app.Gallery = Gallery;
})(window);
