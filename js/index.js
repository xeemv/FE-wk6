/* create classes for our houses
 *  - rooms
 *  - houses
 *  - house service - ajax to preexisting api
 *      - to send http request 
 *  - to manage the doms
 *      - instead of rewriting the dom or repainting parts of the dom
 *      - we will clear out the dom/element every time we create a house 
 *        in the app
 *      - clear it out and then repopulate the houses
 */
console.log("hi");
// basic block
class House{
    constructor(name){
        this.name = name;
        this.rooms = [];
    } 

    // create a method to add a room
    addRoom(name, area){
        this.rooms.push(new Room(name, area));
        // push a new instance of a room w/ the name & area
        // add to the rooms array on line 17
    }
}

// create the rooms
class Room{
    constructor(name, area){
        this.name = name;
        this.area = area;
    }
}

// create the service class to store our methods
// how will we send the https request
class HouseService{
    static url = "https://ancient-taiga-31359.herokuapp.com/api/houses"; 
    // root url for all the endpoints we are going to call to the api

    /*
    - create methods:
        - creating house
        - forgetting a house
        - deleting a house
        - getting all houses
        - getting a specific house
        - updating a house
    */

    static getAllHouses(){
        return $.get(this.url);
        // return all of the houses from the url
    }

    static getHouse(id){
        // get a specific house using the id
        return $.get(this.url + `/${id}`);
        // concatenate and use template literal for the id
    }

    static createHouse(house){
        // take a house
        // an instance of our house class
        // take something that has a name and then an array
        // take the house and post to the api
        return $.post(this.url, house);
        // the house in this retrun is the HDTV payload
    }

    /*
    - the reason we are returning all of these getAllHouses getHouse, createHouse
        - we will be using it somewhere
        - where ever we use these methods, we want to be able to handle the promise that comes back
            - it will make the house service reuseable
    - if this were to grow to a larger application:
        - we could reuse this house service anywhere we needed to access the calls to our house api
    */

    static updateHouse(house){
        // use ajax method for this one
        return $.ajax({
            url: this.url + `/${house._id}`,
            /* 
            - object
            - takes one parameter
            - this is the object has multile fields that make up the data needed to send this request
            - concatenate the ID of the house that we passed in and grab the id from the house
                - the id will tell the API which house we want to update in the database
                - ID is underscore because that is the value that the database will automatically create for our house
            - using a mongo database in this section
            */
           dataType: 'json',
           data: JSON.stringify(house),
            // payload is set to json
            // it will take house as the object which is passed in as a parameter
            // then convert the object(s) into a json string to send it through the http request
           contentType: "application/json",
           type: 'PUT'
            // type is the http verb
            // put request is the type
            // what is the post 
        });
    }

    static deleteHouse(id){
    // we dont need the house for this method
    // only need the id to tell the api ==> that is how the api works
    // what ever house matches the id, go ahead and delete it
    // use ajax method
        return $.ajax({
            // take an object
            url: this.url + `/${id}`,
            type: "DELETE"
        });
    }
}



/*======================================================*/
    /* Dom section */
/*======================================================*/
// where the hard work will happen
// will repaint or rerender our dom each time we create a new class
// create the DOM Manager class
// use top-down process
class DOMManager{
    static houses;
    // this is a veriable
    // used to represent all the houses in this class

    static getAllHouses(){
    // will call the getAllHouses method from inside the service class
    // render them to the DOM
        HouseService.getAllHouses().then(houses => this.render(houses));
        // use the house service to getAllHouses
        // return a promise using ---> .then
        // when we get back, it will call houses
        // this takes a call back that we will pass into this.render
    }

    // create house
    static createHouse(name){
        HouseService.createHouse(new House(name))
        // creating a new instance of a house with the new House name
        // the class for house is on code line 14
        .then(() => {
            // .then to handle a promise
            return HouseService.getAllHouses();
            // get all the houses from the api + the new house
        })
        .then((houses) => this.render(houses));
        // render to the dom the newly created house
    }


    // add room
    static addRoom(id){
        // new room will be added using the static house to find the id
        // then the new room will be added to that house based on the matching id
        for (let house of this.houses){
            // will look for a house in our array houses using a loop
            
            if(house._id == id){
                // we want the id of the current house we are looking at to match a house id in our current array
                house.rooms.push(new Room
                    ($(`#${house._id}-room-name`).val(),
                    $(`#${house._id}-room-area`).val()));
                // we will push the new room of the house into our room class (code line 29)
                // contstructor has two parameters
                    // name, area  <---- these two must be included
                // we want the parameters to match up
                // the name & area will come from the render section below
                    // w/in our app.prepend section line 218 and 221 so use that in the code line on 168
                // I split line 160 and 170 on separate lines for easier reading
                // we are using both jquery method and template literals for these two parameters
            }
        }
    }

    // delete house
    static deleteHouse(id){
        HouseService.deleteHouse(id)
        // this will use the houseService method to delete the house that matches the id
        // using the deleteHouse method and Id (id was the parameter also used in the original method)
            .then(() => {
                // use the .then handle
                // return a promise
                return HouseService.getAllHouses();
                // send an http request to get the updated houses left after deleting one
                // once we delete a house and it comes back successful
                // we want to go a head and get/call all the houses again
            })
            .then((houses) => this.render(houses));
            // once we get the houses, we want to render the houses
            // houses will pass them back into the desktop render house method below
    }

    // build out the render method
    static render(houses){
        // will render to the dom
        this.houses = houses;
        $('#app').empty();
        // jquery to find the app by html id
        // empty the app div then rerender everything
        for (let house of houses){
        // use a for loop
            $("#app").prepend(
                // using prepend so the newest one shows up on top
                // now build the HTML for every single house
                // write the html in js using template literals
                `<div id="${house._id}" class="card">
                    <div class="card-header">
                    <h2>${house.name}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deleteHouse("${house._id}")">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                        <div class="row">
                            <div class="col-sm">
                                <input type="text" id="${house._id}-room-name" class="form-control" placholder="Room Name">
                            </div>
                            <div class="col-sm">
                            <input type="text" id="${house._id}-room-area" class="form-control" placholder="Room Area">
                            </div>
                        </div>
                        <button id="${house._id}-new-room" onclick="DOMManager.addRoom('${house._id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div>`
                // the house in this iteration is of this loop
            );
            for (let room of house.rooms) {
                // create a nested loop to add rooms
                $(`#${house._id}`).find('.card-body').append(
                   `<p>
                   <span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
                   <span id="are-${room._id}"><strong>Name: </strong> ${room.area}</span>
                   <button class="btn btn-danger" onclick="DOMManger.deleteRoom('${house._id}', '${room._id}')"> Delete Room</button>` 
                );
            }
        }
    }
}


$('#create-new-house').click(() => {
    // for the create new house button
    // cant use onclick for this one
    DOMManager.createHouse($('#new-house-name').val())
    // passing the new house name as the value in this line of code
    $('#new-house-name').val('');
    // after the new house has been created and pushed to the DOM/api, we will clear that field to allow the user to enter a new house name
});

DOMManager.getAllHouses();