AFRAME.registerComponent('distance-display', {
    schema: {
        type: { type: 'string' }
    },

    init: function() {
        this.label = document.createElement('div');
        this.label.className = 'distance-label';
        document.body.appendChild(this.label);
        
        // Update distance every second
        // this.updateInterval = setInterval(() => {
        //     this.updateDistance();
        // }, 1000);
    },

    updateDistance: function() {
        const camera = document.querySelector('[gps-camera]');
        if (!camera.components['gps-camera']) return;

        const currentPos = camera.components['gps-camera'].currentCoords;
        const entityPos = {
            latitude: this.el.getAttribute('gps-entity-place').latitude,
            longitude: this.el.getAttribute('gps-entity-place').longitude
        };

        const distanceInMeters = this.calculateDistance(
            currentPos.latitude,
            currentPos.longitude,
            entityPos.latitude,
            entityPos.longitude
        );
        
        // Convert meters to yards (1 meter = 1.09361 yards)
        const distanceInYards = distanceInMeters * 1.09361;

        // Scale calculation based on 500 yards reference distance
        const referenceDistance = 500; // yards now
        const baseScale = 100;
        const scaleFactor = 0.5;
        
        // Use yards for scaling calculation
        const scale = baseScale * (referenceDistance / distanceInYards) ** scaleFactor;
        const clampedScale = Math.min(Math.max(scale, 50), 200);
        this.el.setAttribute('scale', `${clampedScale} ${clampedScale} ${clampedScale}`);

        // Get screen position
        const objectPos = this.el.object3D.position;
        const vector = objectPos.clone();
        const canvas = document.querySelector('canvas');
        vector.project(camera.components.camera.camera);

        const x = (vector.x + 1) / 2 * canvas.clientWidth;
        const y = (-vector.y + 1) / 2 * canvas.clientHeight;

        // Update label position and content
        this.label.style.left = `${x}px`;
        this.label.style.top = `${y}px`; // Centered on ring
        this.label.textContent = `${distanceInYards.toFixed(0)}yd`;
    },

    calculateDistance: function(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    },

    remove: function() {
        if (this.label) {
            this.label.parentNode.removeChild(this.label);
        }
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}); 