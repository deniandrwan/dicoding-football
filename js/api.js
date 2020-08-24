const baseUrl = "https://api.football-data.org/v2";
const endPointClub = `${baseUrl}/competitions/2019/teams`;
const endPointClubId = `${baseUrl}/teams/`;
const endPointLeagueTable = `${baseUrl}/competitions/2019/standings`;
const apiToken = "733363451ed944cabd1cfa722c1f9164";

const apiData = (url) => {
  return fetch(url, {
    headers: {
      "X-Auth-Token": apiToken,
    },
  });
};

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

function getClub() {
  if ("caches" in window) {
    caches.match(endPointClub).then((response) => {
      if (response) {
        response.json().then((serieATim) => {
          clubResult(serieATim);
        });
      }
    });
  }

  apiData(endPointClub)
    .then(status)
    .then(json)
    .then((serieATim) => {
      clubResult(serieATim);
    });
}

function getClubById() {
  return new Promise(function (resolve, reject) {
    const urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("id");

    if ("caches" in window) {
      caches.match(endPointClubId + idParam).then((response) => {
        if (response) {
          response.json().then((clubDetails) => {
            detailClubResult(clubDetails);
            resolve(clubDetails);
          });
        }
      });
    }

    apiData(endPointClubId + idParam)
      .then(status)
      .then(json)
      .then((clubDetails) => {
        detailClubResult(clubDetails);
        resolve(clubDetails);
      });
  });
}

function getSavedClub() {
  getAll().then((clubSave) => {
    console.log(clubSave);
    savedClubResult(clubSave);
  });
}

function getSavedClubById() {
  const urlParams = new URLSearchParams(window.location.search);
  let idParam = urlParams.get("id");
  console.log(idParam);

  byId(parseInt(idParam)).then((clubDetails) => {
    savedClubByIdResult(clubDetails);
  });
}

// Handle View //

function clubResult(serieATim) {
  let clubHTML = "";
  serieATim.teams.forEach(function (club) {
    let urlImage = club.crestUrl;
    clubBadge = urlImage.replace(/^http:\/\//i, "https://");
    clubHTML += `          
      <div class="col m3 s12">
        <a href=./pages/detail.html?id=${club.id}>              
          <div class="card z-depth-3">
            <div class="card-image">
              <img src="${clubBadge}" alt="seria tim logo">        
            </div>
            <div class="card-content">
              <p class="truncate">${club.name}</p>
            </div>        
          </div>
        </a> 
      </div>                          
    `;
  });

  $("#club-list").html(clubHTML);
}

function detailClubResult(clubDetails) {
  let urlImage = clubDetails.crestUrl;
  let name = clubDetails.name;
  let web = `
    <div class="detail-link">
      <a target="_blank" href="${clubDetails.website}">${clubDetails.website}</a>
    </div>
  `;
  clubBadge = urlImage.replace(/^http:\/\//i, "https://");
  let badge = `
    <div class="card-image-detail">
      <img src="${clubBadge}" alt="logo ${clubBadge}">
    </div>
  `;
  let detail = `
    <div class="club-detail">
      ${badge}
      <p><span>Full Name</span>    ${clubDetails.name} </p>
      <p><span>Short Name</span>   ${clubDetails.shortName} </p>
      <p><span>Club Colors</span>  ${clubDetails.clubColors} </p>
      <p><span>Address</span>      ${clubDetails.address}</p>
      <p><span>Phone</span>        ${clubDetails.phone}</p>
      <p><span>Email</span>        ${clubDetails.email}</p>              
      <p><span>Founded </span>     ${clubDetails.founded}</p>
      <p><span>Venue</span>        ${clubDetails.venue} </p>
      ${web}        
    </div>
  `;

  let squad = "";
  let no = 1;
  clubDetails.squad.forEach((player) => {
    squad += `
      <tr>
        <td>${no}</td>
        <td>${player.name}</td>
        <td>${player.position}</td>                
        <td>${player.countryOfBirth}</td>
        <td>${player.nationality}</td>                                                
      </tr>
    `;
    no++;
  });

  $("#name").html(name);
  $("#web").html(web);
  $("#badge").html(badge);
  $("#detail").html(detail);
  $("#squad").html(squad);
}

function savedClubResult(clubSave) {
  if (clubSave.length > 0) {
    let clubFav = "";
    clubSave.forEach((clubFavorit) => {
      let urlImage = clubFavorit.crestUrl;
      clubBadge = urlImage.replace(/^http:\/\//i, "https://");
      clubFav += `
        <div class="col m3 s12">
          <a href="./pages/detail.html?id=${clubFavorit.id}&saved=true">              
            <div class="card z-depth-3">
              <div class="card-image">
                <img src="${clubBadge}" alt="seria tim logo">        
              </div>
              <div class="card-content">
                <p class="truncate">${clubFavorit.name}</p>
              </div>                              
            </div>        
          </a> 
        </div>
      `;
    });

    $("#club-save").html(clubFav);
  } else {
    let noAdded = "";
    noAdded += `
    <div class="row center custom-h5">
        <h5>no clubs added !</h5>
    </div>
    `;
    $("#club-save").html(noAdded);
  }
}

function savedClubByIdResult(clubDetails) {
  let urlImage = clubDetails.crestUrl;
  let name = clubDetails.name;
  let web = `
  <div class="detail-link">
    <a target="_blank" href="${clubDetails.website}">${clubDetails.website}</a>
  </div>
  `;
  clubBadge = urlImage.replace(/^http:\/\//i, "https://");
  let badge = `
  <div class="card-image-detail">
    <img src="${clubBadge}" alt="logo ${clubBadge}">
  </div>
  `;
  let detail = `
  <div class="club-detail">
    ${badge}
    <p><span>Full Name</span>    ${clubDetails.name} </p>
    <p><span>Short Name</span>   ${clubDetails.shortName} </p>
    <p><span>Club Colors</span>  ${clubDetails.clubColors} </p>
    <p><span>Address</span>      ${clubDetails.address}</p>
    <p><span>Phone</span>        ${clubDetails.phone}</p>
    <p><span>Email</span>        ${clubDetails.email}</p>              
    <p><span>Founded </span>     ${clubDetails.founded}</p>
    <p><span>Venue</span>        ${clubDetails.venue} </p>
    ${web}              
  </div>
  `;

  let squad = "";
  let no = 1;
  clubDetails.squad.forEach((player) => {
    squad += `
    <tr>
      <td>${no}</td>
      <td>${player.name}</td>
      <td>${player.position}</td>                
      <td>${player.countryOfBirth}</td>
      <td>${player.nationality}</td>                                                
    </tr>
    `;
    no++;
  });

  $("#name").html(name);
  $("#web").html(web);
  $("#badge").html(badge);
  $("#detail").html(detail);
  $("#squad").html(squad);
}
