$(function () {
    var ViewModel = function () {
        var self = this;

        self.userId = ko.observable();
        self.roomId = ko.observable();
        self.chatLog = ko.observableArray([]);
        self.messageText = ko.observable();
        self.addMessageToLog = function (sender, message) {
            self.chatLog.push(new MessageModel(sender, message));
            self.messageText('');
            updateScroll("chatterBox");
        };

        //Detects keypress(enter) - being used by input box
        self.sendMessage = function (d, e) {
            e.keyCode === 13 && self.sendMessageToServer();
            return true;
        };
        self.sendMessageToServer = function () { }

        //Gets called once the vm is applied and connection to the hub is established
        self.init = function () {
            var introMsg = [];
            introMsg.push("Welcome to chatRbox!");
            introMsg.push("This chatroom is 100% anonymous with nothing stored on the server.");
            introMsg.push("Refresh this page to generate a new room or use the existing URL to share and chat with others!");
            //Display welcome message
            for (var entry in introMsg)
                self.addMessageToLog('', introMsg[entry]);
            //for(var i = 0; i < 20; i++){
            //    self.addMessageToLog('test', introMsg);
            //    self.addMessageToLog(self.userId(), introMsg);
            //}
        }
    }

    //Scrolls element to bottom
    var updateScroll = function (id) {
        var element = document.getElementById(id);
        element.scrollTop = element.scrollHeight;
    }

    //Gets Room Id by parsing the url
    var getRoomId = function () {
        var path = window.location.pathname;

        return path.substr(path.lastIndexOf('/') + 1)
    }

    var MessageModel = function (sender, message) {
        this.sender = sender;
        this.message = message;
    }

    var vm = new ViewModel();


    ko.applyBindings(vm);

    var chat = $.connection.chatrHub;
    chat.client.addNewMessageToPage = function (name, message) {
        vm.addMessageToLog(name, message);
    };
    
    chat.client.setUserId = function (id) {        
        vm.userId(id);
        vm.init();
        updateScroll();
    };

    $.connection.hub.start().done(function () {
        var roomId = getRoomId();
        if (roomId.length > 0) {
            chat.server.joinRoom(roomId);
            vm.roomId(roomId);
        }

        chat.server.getUserId(); 

        vm.sendMessageToServer = function () {
            // Call the Send method on the hub. 
            if(vm.messageText() != "")
                chat.server.send(vm.messageText(), roomId);
        };
    });
});