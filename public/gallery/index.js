(function(app) {
  /**
   * Constructor de la galería. Inicializa las funciones y valores necesarios.
   * @param       {string} target Nodo donde se inicializará la galería, ejemplo: '#gallery'
   * @constructor
   */
  function Gallery(target) {
    this._setInstance(target);

    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);

    this.activePicture = 0;
    this.json = [];
  }

  /**
   * Inicializa las imagenes y controles de la galería.
   * @return      {void}
   */
  Gallery.prototype.init = function init() {
    this._fetchJSON()
      .then(() => {
        this.buildControls();
        this.buildPictures();
      });
  };

  /**
   * Obtiene el nodo DOM el cual será el nodo padre de la galería. En caso de no encontrarlo,
   * la función arrojará un error. Además le añade la clase `.gallery`
   * @param       {string} target
   * @return      {void}
   */
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

  /**
   * Lee el JSON donde se encuentra la información de las imágenes descargadas por el comando
   * inicializador. Esto después podría cambiarse a pedir las imágenes directamente a unsplash.com
   * @return      {Promise}
   */
  Gallery.prototype._fetchJSON = function _fetchJSON() {
    return new Promise((resolve, reject) => {
      const request = new Request('pictures.json');

      fetch(request)
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se puede obtener el json de imágenes. Inicializaste el proyecto?");
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

  /**
   * Elimina los elementos DOM por medio de un query indicado
   * @param       {string} target Por ejemplo: '.gallery__picture'
   * @return      {void}
   */
  Gallery.prototype._clearElements = function _clearElements(target) {
    const pictures = document.querySelectorAll(target);
    pictures.forEach((picture) => {
      picture.parentNode.removeChild(picture);
    });
  };

  /**
   * Construye las imágenes en base al JSON
   * @return {void}
   */
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

  /**
   * Crea y registra los controles de la galería
   * @return {void}
   */
  Gallery.prototype.buildControls = function buildControls() {
    this._clearElements('.gallery__control');

    const buildControl = (name, iconClassName) => {
      const elm = document.createElement('div');
      elm.classList.add('gallery__control');
      elm.classList.add(`gallery__control--${name}`);

      const icon = document.createElement('span');
      icon.classList.add('far');
      icon.classList.add(iconClassName);

      elm.appendChild(icon);
      this.instance.appendChild(elm);


      return elm;
    };

    const prev = buildControl('previous', 'fa-angle-right');
    const next = buildControl('next', 'fa-angle-left');

    prev.addEventListener('click', this.previous, false);
    next.addEventListener('click', this.next, false);
  };

  /**
   * Obtiene la siguiente imagen.
   * @return {void}
   */
  Gallery.prototype.next = function next() {
    if (this.activePicture === this.json.length - 1) {
      this.activePicture = 0;
    } else {
      this.activePicture += 1;
    }

    this._setActivePicture();
  };

  /**
   * Obtiene la imagen anterior.
   * @return {void}
   */
  Gallery.prototype.previous = function previous() {
    if (this.activePicture === 0) {
      this.activePicture = this.json.length - 1;
    } else {
      this.activePicture -= 1;
    }

    this._setActivePicture();
  };

  /**
   * Le asigna la clase indicada a la imágen activa. Esto es necesario para que se aplique la
   * animación de CSS
   * @return {void}
   */
  Gallery.prototype._setActivePicture = function _setActivePicture() {
    const currentActivePicture = document.querySelector('.gallery__picture--active');
    if (currentActivePicture) {
      currentActivePicture.classList.remove('gallery__picture--active');
    }

    const picture = document.querySelectorAll('.gallery__picture')[this.activePicture];
    picture.classList.add('gallery__picture--active');

    this._updateControlsColor();
  };

  Gallery.prototype._updateControlsColor = function _updateControlsColor() {
    const picture = this.json[this.activePicture];
    if (!picture) return;

    const controls = document.querySelectorAll('.gallery__control .far');
    controls.forEach((control) => {
      control.style.color = picture.color;
    });
  };

  /**
   * Registra la clase Gallery en `app` (en este caso es window). Esto es necesario para poder
   * utilizar la galería en otro `<script />`
   */
  app.Gallery = Gallery;
})(window);
