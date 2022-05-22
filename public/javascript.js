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
    // console.log(cards_res);
    lists_res.forEach(function(item_list, index_list){
        var temp = cards_res.filter(x => x.idList == item_list.id );
        temp.forEach(function(item, index){
            let member = members_res.filter(x => x.id == item.idMembers[0] );
            $(`.progress-wrap .num${index_list}`).after(`
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

    // allCards
    var all_cards = await fetch('https://api.trello.com/1/boards/'+boards_res[0].id+'/cards/all?key=f08c459a0ab63f6b01ec0873fd5f557f&token=89013700d209acf80933df82c659093adc24d6b4387492d3e2e0d8607dbc2c9c', requestOptions)
    var all_cards_res = await all_cards.json();
    console.log('54a',all_cards_res)

    // actions
    var actions = await fetch('https://api.trello.com/1/boards/'+boards_res[0].id+'/actions?key=f08c459a0ab63f6b01ec0873fd5f557f&token=89013700d209acf80933df82c659093adc24d6b4387492d3e2e0d8607dbc2c9c', requestOptions)
    var actions_res = await actions.json();
    console.log(actions_res);
    var start_date = new Date("2022-05-21T10:48:24.704Z");
    console.log(start_date);

    // console.log([69, db]);
    let idx =0;
    const db_scrums = await firestore.getDocs(firestore.collection(db, "scrums"));
    db_scrums.forEach((doc) => {
        idx++;
        let data = doc.data();
        let start_date = new Date(data.start_date);//.toLocaleDateString("en-US");
        let end_date = new Date(data.end_date);//.toLocaleDateString("en-US");
        
        // let history = [{}];
        let backlogs = [];

        let history_raw = actions_res.filter(x => new Date(x.date)<=end_date && new Date(x.date)>=start_date);
        let backlogs_raw = history_raw.filter(x => x.type == "createCard");

        //backlogs
        backlogs_raw.forEach((item, index) =>{
            let card = all_cards_res.filter(x => x.id == item.data.card.id);
            // console.log('82', card);
            let member = members_res.filter(x => x.id == card[0].idMembers[0] );
            // console.log('83',member);
            backlogs.push({
                name: card[0].name,
                member: member[0].fullName,
                idList: card[0].idList
            });
        });
        let backlogs_div = "";
        backlogs.forEach((item, index) =>{
            let temp = `<div class="list">
            <div class="name">${item.member}</div>
            <div class="">${item.name}</div>
            </div>`;
            backlogs_div += temp;
        });

        // history
        let history_div = "";
        history_raw.forEach((item, index) =>{
            let member = members_res.filter(x => x.id == item.idMemberCreator);
            // console.log('102',member);
            let temp = `<div class="list">
                <div class="name">${member[0].fullName}</div>
                <div class="">${item.type}</div>
                <div class="date">${new Date(item.date).toLocaleDateString("en-US")}</div>
            </div>`;
            history_div +=temp
        });

        //Performance member
        let performance_div = "";
        let backlogs_progress = backlogs.filter(x => x.idList == lists_res[2].id);
        // console.log('115',backlogs_progress)
        performance_div += `
            <div class="list project">
                <div class="sub-title">Project Progress</div>
                <div class="bar">
                    <div style="width: ${backlogs_progress.length/backlogs.length*100}%" class="colored-bar"></div>
                </div>
            </div>
        `;
        
        members_res.forEach((item,index) => {
            let backlogs_total = backlogs.filter(x => x.member == item.fullName);
            console.log('114',backlogs)
            let backlogs_noprogress = backlogs_total.filter(x => x.idList == lists_res[0].id);
            let backlogs_onprogress = backlogs_total.filter(x => x.idList == lists_res[1].id);
            let backlogs_done = backlogs_total.filter(x => x.idList == lists_res[2].id);
            let percent = backlogs_done.length/backlogs_total.length*100;
            // console.log(percent);
            let temp = `
                <div class="list member">
                    <div class="sub-title">${item.fullName} Progress</div>
                    <div class="bar">
                        <div style="width: ${percent}%" class="colored-bar"></div>
                    </div>
                </div>`;
            performance_div +=temp;
        })

        $('.main-start-scrum').after(`
            <div class="main-scrum">
                <div class="scrum">
                    <div class="title-section">Scrum #${idx}</div>
                    <div class="scrum-wrapper">
                        <div class="dates">
                            <div class="flex">
                                <div>Start Date</div>
                                <div>: ${start_date.toLocaleDateString("en-US")}</div>
                            </div>
                            <div class="flex">
                                <div>End Date</div>
                                <div>: ${end_date.toLocaleDateString("en-US")}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="history-analytics">
                    <div class="history">
                        <div class="title-section">History</div>
                        <div class="history-wrap">
                            ${history_div}
                        </div>
                    </div>
                    <div class="backlog">
                        <div class="title-section">Backlogs</div>
                        <div class="history-wrap">
                            ${backlogs_div}
                        </div>
                    </div>
                    <div class="analytics">
                        <div class="title-section">Performance</div>
                        <div class="peformance-wrap">
                            ${performance_div}
                        </div>
                    </div>
                </div>
                <hr>
            </div>
        `);
    });

    // create scrum
    $('.new-scrum').click(function(){
        let start = $('#start-date').val();
        let end = $('#end-date').val();
        createScrum(start,end);
    });

    const createScrum = async (start, end) => {
        try {
            const docRef = await firestore.addDoc(firestore.collection(db, "scrums"), {
                id: 0,
                start_date: start,
                end_date: end,
                status: "none"

            });
            console.log("Document written with ID: ", docRef.id);
            } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    // actions_res.forEach(function(item, index){
    //     let item_date = new Date(item.date);
         
    //     let end_date = new Date("2022-03-11T10:48:24.704Z");
    //     if(item_date <= end_date){
    //         // try {
    //         //     const docRef = await firestore.addDoc(firestore.collection(db, "backlogs"), {
    //         //         date: new Date(item.date),
    //         //         id: item.id,
    //         //         name: item.name,

    //         //     });
    //         //     console.log("Document written with ID: ", docRef.id);
    //         //     } catch (e) {
    //         //     console.error("Error adding document: ", e);
    //         // }
    //     }
    // });
    // try {
    //     const docRef = await firestore.addDoc(firestore.collection(db, "backlogs"), {
          
    //     });
    //     console.log("Document written with ID: ", docRef.id);
    //   } catch (e) {
    //     console.error("Error adding document: ", e);
    // }

    // const querySnapshot = await firestore.getDocs(firestore.collection(db, "scrums"));
    // querySnapshot.forEach((doc) => {
    //     console.log([doc.id, doc.data()]);
    // });
};