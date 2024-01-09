import React from "react";

// - tiempo total a klarna
// - breakdown del camino (Tcaminando, TBus, Tmetro)
// - precio
// - fechas de disponibilidad (creo que eso es especifico de esa pagina, pero creo que es importante)
// - rooms/bedrooms/bathrooms
// - sector (eso se llama sector alla?) pa no es relevante porque como no conozco nada, pero pa alguien que conozca si una zona es jevi o no, o comoda es pila de importante
// - apart/casa
// - furnished/unfurnished
// - deposit

const listing = {
  commute: 60,
  commuteBreakDown: {
    walking: 15,
    metro: 45,
    bus: 0
  },
  availableFrom: new Date(),
  availableTo: new Date(),
  rooms: 3,
  bedrooms: 2,
  bathrooms: 2,
  type: "apt",
  price: 15000,
  deposit: 30000,
  furnished: true,
  sector: "Bromma"
};

// TODO: colorize commute breakdown

const Card = () => {
  const commuteBreakDown = [
    listing.commuteBreakDown.walking,
    listing.commuteBreakDown.metro,
    listing.commuteBreakDown.bus
  ].join(",");

  const from = '01/11/19'; //listing.availableFrom.toUTCString()
  const to = '01/01/20'; //listing.availableFrom.toUTCString()
  return (
    <div className="card-container col-md-6">
      <div className="card">
        <div className="row no-gutters">
          <div className="col-md-4">
            <img
              src="https://via.placeholder.com/500"
              className="card-img"
              alt="inserte nombre del barrio aqui, posiblemente un link al source"
            />
          </div>
          <div className="col-md-8">
            <div className="card-header">
              <div className="row">
                <div className="col commute">
                  <i class="fas fa-briefcase"></i>
                  <span>{`${listing.commute}m [${commuteBreakDown}]`}</span>
                </div>
                <div className="col price">${listing.price}</div>
              </div>
            </div>
            <div className="card-body">
              <p className="card-text">
                <div className="availability">
                  Availability: {from} > {to}
                </div>
                <div className="rooms">
                  <i class="fas fa-cubes"></i>: {listing.rooms}
                  <i class="fas fa-bed"></i>: {listing.bedrooms}
                  <i class="fas fa-toilet"></i>: {listing.bathrooms}
                </div>
                <div className="type">
                  <i class={`fas ${listing.type === 'apt'? 'fa-building' : 'fa-home' }`}></i>
                </div>
                <div className="sector">
                  <a href="https://google.com">{listing.sector}</a>
                </div>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
