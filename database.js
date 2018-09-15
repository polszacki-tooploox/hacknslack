module.exports = {
    initDatabase,
    upsertAchievement,
    upsertQuest,
    updateUserXPAndLevel,
    assignAchievementToUser,
    assignUserToQuest,
    unassignUserFromQuest,
    getAllAchievements,
    getAllQuests,
    getQuest,
    getUserQuests,
    getUserAchievements,
    getAllUsers,
    getUser,
    loadUsersToDatabase,
    getQuestUsers,
    insertEvent,
    getEvents
};

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);


function initDatabase() {
    // if ./.data/sqlite.db does not exist, create it, otherwise print records to console
    db.serialize(function() {
        if (!exists) {
            db.run('CREATE TABLE Users ( \
                id TEXT PRIMARY KEY,\
                name TEXT,\
                roleId TEXT,\
                xp INT, \
                level INT)'
            );
            console.log('New table Users created!');

            db.run('CREATE TABLE Achievements (\
                id INTEGER PRIMARY KEY,\
                name TEXT, \
                icon TEXT, \
                description TEXT)'
            );
            console.log('New table Achievements created!');

            db.run('CREATE TABLE Quest (\
                id INTEGER PRIMARY KEY, \
                name TEXT, \
                xp INT, \
                description TEXT, \
                usersLimit INT, \
                messageTimestamp TEXT)'
            );
            console.log('New table Quest created!');

            db.run('CREATE TABLE UserQuest ( \
                userId TEXT, \
                questId TEXT, \
                PRIMARY KEY(userId, questId) \
            )')

            db.run('CREATE TABLE UserAchievement ( \
                userId TEXT, \
                achievementId TEXT, \
                PRIMARY KEY(userId, achievementId) \
            )')
          
            db.run('CREATE TABLE Event (id INTEGER PRIMARY KEY, data TEXT)')
            console.log('New tables created!');
        } else {
            console.log('Database is ready to go!');
        }
    });
}

function upsertUser(user, callback) {
    db.run('INSERT OR REPLACE INTO Users (id, name, roleId, xp, level) VALUES(?, ?, ?, ?, ?)', [user.id, user.fullName, user.roleID, user.xp, user.level], function(err) {
        if (err == null) {
            console.log(`Inserted user ${user.id}`)
            callback()
        } else {
            console.log(err)
        }
    });
}

function upsertAchievement(achievement, callback) {
    db.run('INSERT OR REPLACE INTO Achievements VALUES(?, ?, ?, ?)', [achievement.id, achievement.name, achievement.icon, achievement.description], function(err) {
        if (err == null) {
            console.log(`Inserted achievement ${achievement.name}`)
            callback(this.lastID)
        } else {
            console.log(err)
        }
    });
}

function upsertQuest(quest, callback) {
    db.run('INSERT OR REPLACE INTO Quest (name, xp, description, usersLimit, messageTimestamp) VALUES(?, ?, ?, ?, ?)', [quest.name, parseInt(quest.xp), quest.description, quest.usersLimit, quest.messageTimestamp], function(err) {
        if (err == null) {
            console.log(`Inserted quest ${quest.name}`)
            callback(this.lastID)
        } else {
            console.log(err)
        }
    });
}

function assignUserToQuest(userId, questId) {
    db.run('INSERT OR REPLACE INTO UserQuest VALUES(?, ?)', [userId, questId], function(err) {
        if (err == null) {
            console.log(`Inserted user to quest ${userId} quest: ${questId}`)
        } else {
            console.log(err)
        }
    });
}

function unassignUserFromQuest(userId, questId) {
    db.run('DELETE FROM UserQuest WHERE userId = ? AND questId = ?', [userId, questId], function(err) {
        if (err == null) {
            console.log(`Deleted user <-> quest connection, user: ${userId} quest: ${questId}`)
        } else {
            console.log(err)
        }
    });
}

function assignAchievementToUser(achievementId, userId, callback) {
    db.run('INSERT OR REPLACE INTO UserAchievement VALUES(?, ?)', [userId, achievementId], function(err) {
        if (err == null) {
            console.log(`Inserted user to achievement ${userId} achievement: ${achievementId}`)
            callback()
        } else {
            console.log(err)
        }
    });
}

function updateUserXPAndLevel(userId, xp, level) {
    console.log("Updating points")
    db.run('UPDATE Users SET xp = ?, level = ? WHERE id = ?', [xp, level, userId], function(err) {
        if (err == null) {
            console.log(`Updated xp and level for user ${userId}`)
        } else {
            console.log(err)
        }
    });
}

function getAllUsers(callback) {
    db.all('SELECT u.id, u.name FROM Users', function(err, rows) {
        if (rows) {
            console.log(rows)
            callback(rows)
        } else if (err) {
            console.log(err)
        } else {
            console.log("what")
        }
    });
}

function getUser(userId, callback) {
    db.all('SELECT * FROM Users WHERE id = ?', [userId], function(err, rows) {
        if (rows) {
            callback(rows[0])
        } else if (err) {
            console.log(err)
        } else {
            console.log("what")
        }
    });
}

function getUserAchievements(userId, callback) {
    db.all('SELECT ua.achievementId FROM UserAchievement WHERE userId = ?', [userId], function(err, rows) {
        if (rows) {
            callback(rows)
        } else if (err) {
            console.log(err)
        } else {
            console.log("what")
        }
    });
}

function getUserQuests(userId, callback) {
    db.all('SELECT questId FROM UserQuest WHERE userId = ?', [userId], function(err, rows) {
        if (rows) {
            callback(rows)
        } else if (err) {
            console.log(err)
        } else {
            console.log("what")
        }
    });
}

function getQuestUsers(questId, callback) {
    // 'select *
    // from routes
    // where id in (select allowed_ids
    //              from users
    //              where username = 'sameple')'
    db.all('SELECT * FROM Users WHERE id IN (SELECT userID FROM UserQuest WHERE questId = ?)', [questId], function(err, rows) {
        if (rows) {
            callback(rows)
        } else if (err) {
            console.log(err)
        } else {
            console.log("what")
        }
    });
}

function getQuest(questId, callback) {
    db.all('SELECT * FROM Quest WHERE id = ?', [questId], function(err, rows) {
        if (rows) {
            callback(rows)
        } else if (err) {
            console.log(err)
        } else {
            console.log("what")
        }
    });
}

function getAllAchievements(callback) {
    db.all('SELECT u.id, u.name, u.description, u.icon FROM Achievements', function(err, rows) {
        if (rows) {
            console.log(rows)
            callback(rows)
        } else if (err) {
            console.log(err)
        } else {
            console.log("what")
        }
    });
}

function getAllQuests(callback) {
    db.all('SELECT u.id, u.name, u.description, u.xp FROM Quests', function(err, rows) {
        if (rows) {
            console.log(rows)
            callback(rows)
        } else if (err) {
            console.log(err)
        } else {
            console.log("what")
        }
    });
}

function loadUsersToDatabase(users) {
    for (var i = 0, len = users.length; i < len; i++) {
        let user = users[i]
        getUser(user.id, function(savedUser) {
            if (savedUser == undefined || savedUser == null) {
                var newUser = new Object()
                newUser.id = user.id
                newUser.fullName = user.name
                newUser.level = 1
                newUser.roleID = "Hero"
                newUser.xp = 0
                upsertUser(newUser, function() {})
            }
        })
    }
}

function insertEvent(jsonData) {
    var data = JSON.stringify(jsonData)
    db.run('INSERT OR REPLACE INTO Event (data) VALUES(?)', [data], function(err) {
        if (err == null) {
            console.log(`Inserted event ${data}`)
        } else {
            console.log(err)
        }
    });
}

function getEvents(callback) {
    db.all('SELECT * FROM Event', function(err, rows) {
        if (rows) {
            callback(rows)
        } else if (err) {
            console.log(err)
        } else {
            console.log("what")
        }
    });
}

