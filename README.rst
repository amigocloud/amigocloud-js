amigocloud-js
=============
A simple JavaScript API for AmigoCloud.

Installation
------------

Install as a bower package:

..

    bower install amigocloud-js

Dependencies
------------

- |socket.io|_: Used to listen to server events through websockets.

Quick Start
-----------
Authentication
~~~~~~~~~~~~~~


Once you have installed the library, all you need to do to
get going is authenticate with the server using an ACCESS TOKEN:

.. code:: javascript

    L.amigo.auth.setToken(ACCESS_TOKEN);

After authenticating, ``Amigo.user`` will be set in the Amigo object. This contains all of the information relevant to the authenticated user (returned from the /me endpoint).

Requests
~~~~~~~~

Next you'll want to actually use data from our server. Using the endpoints found in ``L.amigo.utils`` you can start making your own requests and manipulating data.

.. code:: javascript

    var data = {
        'param1': 'value1',
        'param2': 'value2'
    }
    L.amigo.utils.get(someUrl); //will do a simple get request
    L.amigo.utils.get(someOtherUrl, data). // the second parameter is optional
        then(function (responseData) {
            // you can manipulate the data that comes back from hitting someOtherUrl with the GET method.
        });

For POST requests, use the following function (this will create a new project):

.. code:: javascript

    // make sure your access token allows you to do this operation
    L.amigo.utils.post('/me/projects', { name: 'new dataset' }).  //will do a POST request
        then(function (responseData) {
            // you can still manipulate the return data. In this case, it's the new project's information
        });

The ``.then()`` method binds a callback to be run when the response comes back from the server. Its only argument is the response data.

Websockets
~~~~~~~~~~

Make sure to read `our help page about our websocket events <http://help.amigocloud.com/hc/en-us/articles/204246154>`__ before continue reading.

To start listening to websocket events, use the following functions:

.. code:: javascript

    // We recomend excecuting this code only once
    L.amigo.auth.setToken(ACCESS_TOKEN); // set the access token in auth
    L.amigo.events.startListening(); // start listening events

After starting to listen events, you might want to actually bind some callbacks to specific events:

.. code:: javascript

    L.amigo.events.on('dataset:creation_succeeded', function (data) {
        // do something when a dataset is created.
    });

.. |socket.io| replace:: ``socket.io``
.. _socket.io: http://socket.io

AmigoCloud 2015
