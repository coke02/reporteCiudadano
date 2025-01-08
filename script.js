document.addEventListener('DOMContentLoaded', () => {
    // Configuración del mapa
    const DEFAULT_LOCATION = [-33.4489, -70.6693]; // Latitud y longitud de Santiago, Chile
    const DEFAULT_ZOOM = 13;

    // Inicializar el mapa
    const map = L.map('map', { zoomControl: true }).setView(DEFAULT_LOCATION, DEFAULT_ZOOM);

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Crear marcador arrastrable
    const marker = L.marker(DEFAULT_LOCATION, { draggable: true }).addTo(map);

    // Función para actualizar formulario
    function updateForm(lat, lng) {
        document.getElementById('latitude').value = lat.toFixed(6);
        document.getElementById('longitude').value = lng.toFixed(6);
    }

    // Intentar obtener la ubicación actual
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], DEFAULT_ZOOM);
                marker.setLatLng([latitude, longitude]);
                updateForm(latitude, longitude);
            },
            (error) => {
                console.warn('No se pudo obtener la ubicación. Usando ubicación predeterminada:', error.message);
                // Si falla, usar la ubicación predeterminada
                updateForm(DEFAULT_LOCATION[0], DEFAULT_LOCATION[1]);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        console.warn('Geolocalización no soportada. Usando ubicación predeterminada.');
        updateForm(DEFAULT_LOCATION[0], DEFAULT_LOCATION[1]);
    }

    // Actualizar el formulario al mover el marcador
    marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        updateForm(lat, lng);
    });

    // Ajustar el mapa si el tamaño cambia
    window.addEventListener('resize', () => {
        map.invalidateSize();
    });
});

function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('imagePreview');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.src = "#";
        preview.style.display = 'none';
    }
}