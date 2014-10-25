amigocloud-js
=============
A simple JavaScript API for AmigoCloud.

Installation
------------

Install as a bower package:


    bower install amigocloud-js
    
Dependencies
------------

- |socket.io|_: Used to listen to server events through websockets.

Quick Start
-----------
Authentication
~~~~~~~~~~~~~~


Once you have installed the library, all you need to do to 
get going is authenticate with the server:

.. code:: javascript
    
    Amigo.auth.login('your@username.com', 'yourPassword');

After authenticating, ``Amigo.user`` will be set in the Amigo object. This contains all of the information relevant to the authenticated user (returned from the /me endpoint).

Requests
~~~~~~~~

Next you'll want to actually use data from our server. Using the endpoints found in ``Amigo.user`` you can start making your own requests and manipulating data.

.. code:: javascript
    
    Amigo.core.get(someUrl); //will do a simple get request
    Amigo.core.get(someOtherUrl).
        then(function (responseData) {
            // you can manipulate the data that comes back from hitting someOtherUrl with the GET method.
        });

For POST requests, use the following function (this will create a new project):

.. code:: javascript
    
    Amigo.core.post('/me/projects', { name: 'new dataset' }).  //will do a POST request
        then(function (responseData) {
            // you can still manipulate the return data. In this case, it's the new project's information
        });
        
The ``.then()`` method binds a callback to be run when the response comes back from the server. Its only argument is the response data.
        
Websockets
~~~~~~~~~~

To start listening to websocket events, use the following functions:

.. code:: javascript
    
    Amigo.socket.init(); // initialize the sockets handler
    Amigo.socket.listenUserEvents(); // you need to be authenticated first
    
``listenUserEvents()`` is actually shorthand for ``Amigo.socket.authenticate()`` where the user credentials are those set in ``Amigo.user`` after authentication.

After starting to listen events, you might want to actually bind some callbacks to specific events:

.. code:: javascript
    
    Amigo.socket.on('dataset:creation_succeeded', function (data) {
        // do something when a dataset is created.
    });

.. |socket.io| replace:: ``socket.io``
.. _socket.io: http://socket.io

AmigoCloud 2014
