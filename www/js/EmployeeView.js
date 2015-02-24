var EmployeeView = function (employee) {

    this.initialize = function () {
        this.$el = $('<div/>');
        this.$el.on('click', '.add-location-btn', this.addLocation);
        this.$el.on('click', '.add-contact-btn', this.addToContacts);
        this.$el.on('click', '.change-pic-btn', this.changePicture);
        this.$el.on('click', '.play-vid-btn', this.playVideo);
        this.$el.on('click', '.open-pdf-btn', this.openPdf);
    };

    this.render = function () {
        this.$el.html(this.template(employee));
        return this;
    };

    this.addLocation = function (event) {
        event.preventDefault();
        navigator.geolocation.getCurrentPosition(
            function (position) {
                alert(position.coords.latitude + ',' + position.coords.longitude);
            },
            function () {
                alert('Error getting location');
            });
        return false;
    };

    this.addToContacts = function (event) {
        event.preventDefault();        
        if (!navigator.contacts) {
            alert("Contacts API not supported", "Error");
            return;
        }
        var contact = navigator.contacts.create({ 'displayName': employee.firstName + ' ' + employee.lastName });
        contact.name = { givenName: employee.firstName, familyName: employee.lastName };
        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('work', employee.officePhone, false);
        phoneNumbers[1] = new ContactField('mobile', employee.cellPhone, true);
        contact.phoneNumbers = phoneNumbers;
        contact.save();
        alert('Contact added');
        return false;
    };

    this.changePicture = function (event) {
        event.preventDefault();
        if (!navigator.camera) {
            alert("Camera API not supported", "Error");
            return;
        }
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
            encodingType: 0     // 0=JPG 1=PNG
        };

        navigator.camera.getPicture(
            function (imgData) {
                $('.media-object', this.$el).attr('src', "data:image/jpeg;base64," + imgData);
            },
            function () {
                alert('Error taking picture', 'Error');
            },
            options);

        return false;
    };

    this.playVideo = function (event) {
        event.preventDefault();
        $('.videoPlayerDiv').show();
        var player = document.getElementById("videoPlayer");        
        var source = document.createElement('source');        
        var filename = "small.mp4";
        var videoURL = "http://techslides.com/demos/sample-videos/small.mp4";
        //document.getElementById("videoPlayer").src = rootDirectory + "sdcard/Download/small.mp4";
            //alert("fileSystem.root.toURL()=" + fileSystem.root.toURL());
            ///alert("fileSystem.root.toInternalURL()=" + fileSystem.root.toInternalURL());
            //alert("fileSystem.root.nativeURL=" + fileSystem.root.nativeURL);
        //}, function () {
            //alert("fails!");
        //});
        //player.load();
        //player.play();
        requestFileSystem(PERSISTENT, 0, function (fileSystem) {
            var ft = new FileTransfer();
            ft.download(videoURL, fileSystem.root.toURL() + "/" + filename, function (entry) {
                source.setAttribute('src', 'file:///mnt/sdcard/small.mp4');
                player.appendChild(source);
                player.load();
                player.play();
            });
        });        
        return false;
    };

    this.openPdf = function (event) {
        event.preventDefault();
        //requestFileSystem(PERSISTENT, 0, function (fileSystem) {
        var ref = window.open('http://docs.google.com/viewer?url=file:///mnt/sdcard/Download/EstadoDeCuenta.pdf', '_blank', 'location=yes');
        //});
        //window.plugins.fileOpener.open("file:///mnt/sdcard/Download/EstadoDeCuenta.pdf")        
        return false;
    };

    this.initialize();

}