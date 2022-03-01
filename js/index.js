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

// create the service
// how will we send the https request
class HouseService{
    static url ='https://ancient-taiga-31359.herokuapp.com/api/houses';
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

    // build out the render method
    static render(houses){
        // will render to the dom
        this.houses = houses;
        $('#app').empty();
        // jquery to find the app by html id
        // empty the app div then rerender everything
        for(let house of houses){
        // use a for loop
            $("#app").prepend(
                // using prepend so the newest one shows up on top
                // now build the HTML for every single house
                // write the html in js using template literals
                `<div id="${house._id}" class="card">
                    <div class="card-header">
                    <h2>${house.name}</h2>
                    <button class="btn btn-danger" onclick="DOMManager.deleteHouse("${house._id}")">Delete</delete>
                    </div>
                </div>
                `
            );
        }
    }
}


DOMManager.getAllHouses();