/**
 * Inicializa la aplicación
 */
(function() {
  const gallery = new Gallery('#galeria');
  gallery.init();

  const giphy = new Giphy('#giphy');
  giphy.init();
})();
