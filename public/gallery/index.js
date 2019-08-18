(function(app) {
  function Gallery(target) {
    this._setInstance(target);
  }

  Gallery.prototype._setInstance = function (target) {
    this.target = target;
    this.instance = document.querySelector(target);

    if (!this.instance) {
      throw new Error(
        `No se puede inicializar la galería con: ${target}, revisa que sea correcto.`
      );
    }

    this.instance.className = 'gallery';
  };

  Gallery.prototype._fetchJSON = function () {
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
          this.json = json;

          resolve(json);
        })
        .catch(reject);
    });
  };

  Gallery.prototype.buildPictures = function () {
    if (!this.json) {
      return;
    }

    this.json.forEach((picture) => {
      const element = document.createElement('div');
      element.className = 'gallery__picture';
      element.style.backgroundImage = `url(/pictures/${picture.id}.jpg)`;

      this.instance.appendChild(element);
    });
  };

  Gallery.prototype.init = function init() {
    this._fetchJSON()
      .then(() => this.buildPictures());
  };

  app.Gallery = Gallery;
})(window);
