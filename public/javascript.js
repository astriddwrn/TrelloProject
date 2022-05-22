// API key: f08c459a0ab63f6b01ec0873fd5f557f
// token: 89013700d209acf80933df82c659093adc24d6b4387492d3e2e0d8607dbc2c9c

window.hookFirebase =  async ({firebaseConfig, app, db, firestore}) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic cmVsZWFybi5pZEBnbWFpbC5jb206I1N1a3NlczEyMzQ=");
    myHeaders.append("Cookie", "dsc=c851286e35debfa07812ef6fbe785b491d8772033de09ca30c662ba9cc4d4d2c; preAuthProps=s%3A6229da4b404eb11bd93f20c8%3AisEnterpriseAdmin%3Dfalse.TEVcBR6XJuhrAAuKVyTNo7WDwJTNJYDAHWqCj3lkVuw");
    myHeaders.append("Accept", "application/json")
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
      
    };

    // boards
    var boards = await fetch("https://api.trello.com/1/members/me/boards?fields=name,url&key=f08c459a0ab63f6b01ec0873fd5f557f&token=89013700d209acf80933df82c659093adc24d6b4387492d3e2e0d8607dbc2c9c", requestOptions);
    var boards_res = await boards.json();
    $('.title').html(boards_res[0].name);

    // members
    var members = await fetch('https://api.trello.com/1/boards/'+boards_res[0].id+'/members?key=f08c459a0ab63f6b01ec0873fd5f557f&token=89013700d209acf80933df82c659093adc24d6b4387492d3e2e0d8607dbc2c9c', requestOptions);
    var members_res = await members.json();

    // lists
    var lists = await fetch('https://api.trello.com/1/boards/'+boards_res[0].id+'/lists?key=f08c459a0ab63f6b01ec0873fd5f557f&token=89013700d209acf80933df82c659093adc24d6b4387492d3e2e0d8607dbc2c9c', requestOptions)
    var lists_res = await lists.json();
    // console.log(lists_res);
    
    // cards
    var cards = await fetch('https://api.trello.com/1/boards/'+boards_res[0].id+'/cards?key=f08c459a0ab63f6b01ec0873fd5f557f&token=89013700d209acf80933df82c659093adc24d6b4387492d3e2e0d8607dbc2c9c', requestOptions)
    var cards_res = await cards.json();
    console.log(cards_res);
    lists_res.forEach(function(item_list, index_list){
        // console.log(item.id);
        var temp = cards_res.filter(x => x.idList == item_list.id );
        // console.log(temp);
        temp.forEach(function(item, index){
            // console.log(index);
            let member = members_res.filter(x => x.id == item.idMembers[0] );
            // console.log('member',member);
            $(`.progress-wrap .list.num${index_list}`).after(`
                <div class="list">
                    <div class="header-wrap">
                        <div class="name">${member[0].fullName}</div>
                        <div class="point">8</div>
                    </div>
                    <div class="">${item.name}</div>
                </div>
            `);
        })
    });

    // var scrum = [
    //     {
    //         start_date: new Date("2022-03-10T10:54:59.098Z"),
    //         end_date: 
    //     }
    // ]

    // actions
    var actions = await fetch('https://api.trello.com/1/boards/'+boards_res[0].id+'/actions?key=f08c459a0ab63f6b01ec0873fd5f557f&token=89013700d209acf80933df82c659093adc24d6b4387492d3e2e0d8607dbc2c9c', requestOptions)
    var actions_res = await actions.json();
    console.log(actions_res);
    var start_date = new Date("2022-05-21T10:48:24.704Z");
    console.log(start_date);

    console.log([69, db]);

    const querySnapshot = await firestore.getDocs(firestore.collection(db, "scrums"));
    querySnapshot.forEach((doc) => {
        console.log([doc.id, doc.data()]);
    });
};

// fetch("https://api.trello.com/1/members/me/boards?key=f08c459a0ab63f6b01ec0873fd5f557f&token=89013700d209acf80933df82c659093adc24d6b4387492d3e2e0d8607dbc2c9c", requestOptions)
//   .then(response => response.text())
//   .then((result) =>{
//     console.log(JSON.parse(result));
//   })
//   .catch(error => console.log('error', error));

// var boards, idd ='test';

// fetch("https://api.trello.com/1/members/me/boards?fields=name,url&key=f08c459a0ab63f6b01ec0873fd5f557f&token=89013700d209acf80933df82c659093adc24d6b4387492d3e2e0d8607dbc2c9c", requestOptions)
//   .then(response => response.text())
//   .then((result) =>{
//     // console.log(result);
//     boards = JSON.parse(result);
//     console.log(boards[0].id);
//     idd = boards[0].id
//     $('.title').html(boards[0].name);

//     console.log('1');
//   })
//   .catch(error => console.log('error', error));

// fetch(`https://api.trello.com/1/boards/${idd}/lists?key=f08c459a0ab63f6b01ec0873fd5f557f&token=89013700d209acf80933df82c659093adc24d6b4387492d3e2e0d8607dbc2c9c`, requestOptions)
//   .then(response => response.text())
//   .then((result) =>{
//     // console.log(result);
//     var list = JSON.parse(result);
//     // console.log(list);

//     // $('.title').html(boards[0].name);
//     console.log('2');
//   })
//   .catch(error => console.log('error', error));