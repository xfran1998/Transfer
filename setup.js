const fs = require('fs');
const path = require('path');
const cronJob = require('cron').CronJob;
const DB = require(path.join(__dirname, 'database', 'database.js'));

function setup_cron() {
    // create a new cron job to run at 00:00:00 everyday
    var job = new cronJob(
        '0 0 1 * * *', 
        // '0 * * * * *', 
        () => {
            console.log('cron job');
            const db_conn = new DB();
            
            delete_deprecated_users(db_conn);
        }
    );

    job.start();
}

async function delete_deprecated_users(db_conn) {
    // Insert into aux table the users that are expired
    await db_conn.add_aux_user();  
    const users = await db_conn.get_deleted_users();

    // Delete the folders of the users that are expired
    delete_folders(users);

    // Delete the users from the users table
    await db_conn.delete_user_from_aux_to_users();
    // Delete the users from the aux_users table
    await db_conn.delete_aux_users();

    db_conn.close();
}

function delete_folders(users) {
    console.log('delete_folders');
    console.log(JSON.stringify(users));
    

    // Delete the folders of the users that are expired
    users.forEach( (user) => {
        console.log(user)
        const path_folder = path.join(__dirname, 'transfer', user.username);

        if (fs.existsSync(path_folder)) {
            fs.rm(path_folder, 
                { recursive: true },
                (err) => {
                    if(err){
                        // File deletion failed
                        console.error(err.message);
                        return;
                    }
                    console.log("File deleted successfully")
                });
        }
    });
}

module.exports = { setup_cron };