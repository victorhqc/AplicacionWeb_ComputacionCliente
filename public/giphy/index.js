(function(app) {
  function Giphy(target) {
    this.target = target;
    this.instance = null;
    this.wrapper = null;
    this.imgContainer = null;
    this.searchInput = null;
    this.config = null;
    this.gifs = [];

    this._handleButtonClick = this._handleButtonClick.bind(this);
  }

  Giphy.prototype.init = function init() {
    this._setInstance();
    this._buildDOM();
    this._fetchConfiguration().catch((e) => {
      throw new Error(e);
    });
  };

  Giphy.prototype._setInstance = function _setInstance() {
    this.instance = document.querySelector(this.target);
    if (!this.instance) {
      throw new Error(`Falló la inicialización de la instancia, revisa que ${this.target} exista.`);
    }
  };

  Giphy.prototype._buildDOM = function _buildDOM() {
    if (!this.instance) {
      throw new Error(
        'La instancia no se ha inixializado aún, olvidaste ejecutar `giphy.init()`?'
      );
    }

    this._clearElements('.giphy');
    this._clearElements('.giphy__input');
    this._clearElements('.giphy__image');

    const wrapper = document.createElement('div');
    wrapper.classList.add('giphy');
    this.wrapper = wrapper;

    const form = document.createElement('form');
    form.classList.add('giphy__form');

    const inputText = document.createElement('input');
    inputText.setAttribute('placeholder', 'Ingresa alguna palabra...');
    inputText.classList.add('giphy__input');
    inputText.classList.add('giphy__input--search');
    form.appendChild(inputText);
    this.searchInput = inputText;

    const button = document.createElement('button');
    button.setAttribute('role', 'submit');
    button.classList.add('giphy__input');
    button.classList.add('giphy__input--button');
    form.appendChild(button);

    button.addEventListener('click', this._handleButtonClick, false);

    const searchText = document.createTextNode('Buscar Gif!');
    button.appendChild(searchText);

    wrapper.appendChild(form);

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('giphy__images--wrapper');
    wrapper.appendChild(imgContainer);

    this.imgContainer = imgContainer;

    this.instance.appendChild(wrapper);
  };

  Giphy.prototype._fetchConfiguration = function _fetchConfiguration() {
    return new Promise((resolve, reject) => {
      const request = new Request('giphy.json');
      fetch(request)
        .then((response) => {
          if (!response.ok) {
            throw new Error('No se puede solicitar el json de giphy. Inicializaste el proyecto?');
          }

          return response.json();
        })
        .then((json) => {
          this.config = json;
          resolve(json);
        })
        .catch(reject);
    });
  };

  Giphy.prototype.searchGifs = function searchGifs(input) {
    return new Promise((resolve, reject) => {
      if (!this.config) {
        return reject('config no existe, olvidaste ejecutar `giphy.run()`?');
      }

      const apiKey = `api_key=${this.config.giphy_key}`;
      const query = `q=${input}`;
      const language = `lang=en`;
      const parameters = `${apiKey}&${query}&${language}`;
      const request = new Request(
        `${this.config.giphy_url}/gifs/search?${parameters}`,
        {
          method: 'GET',
          mode: 'cors',
          credentials: 'same-origin',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }
      );

      fetch(request)
        .then((response) => {
          if (!response.ok) {
            throw new Error('No se ha podido solicitar el gif a Giphy, algo anda mal');
          }

          return response.json();
        })
        .then((json) => {
          this.gifs = json.data;
          resolve(json);
        })
        .catch(reject);

    });
  };

  Giphy.prototype.getRandomGif = function getRandomGif() {
    if (this.gifs.length === 0) return null;

    const index = Math.floor(Math.random() * this.gifs.length);

    return this.gifs[index];
  };

  Giphy.prototype._handleButtonClick = function _handleButtonClick(e) {
    e.preventDefault();

    const needle = this.searchInput.value;
    if (!needle) return this._clearElements('.giphy__image');;
    this.searchGifs(needle)
      .then(() => {
        const gif = this.getRandomGif();
        console.log('GIF', gif);
        if (!gif) return;
        this._renderGif(gif);
      })
      .catch((e) => {
        throw new Error(e);
      });
  };

  Giphy.prototype._renderGif = function _renderGif(gif) {
    this._clearElements('.giphy__image');

    const picture = gif.images.downsized_medium;

    const img = document.createElement('img');
    img.setAttribute('src', picture.url);
    img.setAttribute('width', picture.width);
    img.setAttribute('height', picture.height);
    img.classList.add('giphy__image');

    this.imgContainer.appendChild(img);
  };

  /**
   * Elimina los elementos DOM por medio de un query indicado
   * @param       {string} target Por ejemplo: '.gallery__picture'
   * @return      {void}
   */
  Giphy.prototype._clearElements = function _clearElements(target) {
    const pictures = document.querySelectorAll(target);
    pictures.forEach((picture) => {
      picture.parentNode.removeChild(picture);
    });
  };

  app.Giphy = Giphy;
})(window);
