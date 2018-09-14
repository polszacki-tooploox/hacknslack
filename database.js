module.exports = {
    init: function() {
        initDatabase()
    },
    upsertUser: function(user, callback) {
        upsertUser(user, callback)
    },
    upsertAchievement: function(achievement, callback) {
        upsertAchievement(achievement, callback)
    },
    upsertQuest: function(quest, callback) {
        upsertQuest(quest, callback)
    },
    updateUserXPAndLevel: function(xp, level) {
        updateUserXPAndLevel(xp, level)
    },
    assignAchievementToUser: function(userId, achievementId) {
        assignAchievementToUser(userId, achievementId)
    },
    assignUserToQuest: function(userId, questId) {
        assignUserToQuest(userId, questId)
    },
    getAllAchievements: function(callback) {
        getAllAchievements(callback)
    },
    getAllQuests: function(numberOfUsers, callback) {
        getAllQuests(numberOfUsers, callback)
    },
    getQuest: function(questId, callback) {
        getQuest(questId, callback)
    },
    getUserQuests: function(userId, callback) {
        getUserQuests(userId, callback)
    },
    getUserAchievements: function(userId, callback) {
        getUserAchievements(userId, callback)
    },
    getAllUsers: function(callback) {
        getAllUsers(callback)
    },
    getUser: function(userId, callback) {
        getUser(userId, callback)
    }
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
                description TEXT)'
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
            console.log('New tables created!');
        } else {
            console.log('Database is ready to go!');
        }
    });
}

function upsertUser(user, callback) {
    db.run('INSERT OR REPLACE INTO Users VALUES(?, ?, ?, ?, ?)', [user.id, user.name, user.roleId, user.xp, user.level], function(err) {
        if (err == null) {
            console.log(`Inserted user ${user.name}`)
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
            callback()
        } else {
            console.log(err)
        }
    });
}

function upsertQuest(quest, callback) {
    db.run('INSERT OR REPLACE INTO Quest (name, xp, description) VALUES(?, ?, ?)', [quest.name, parseInt(quest.xp), quest.description], function(err) {
        if (err == null) {
            console.log(`Inserted quest ${quest.name}`)
            callback(this.lastID)
        } else {
            console.log(err)
        }
    });
}

function assignUserToQuest(userId, questId, callback) {
    db.run('INSERT OR REPLACE INTO UserQuest VALUES(?, ?)', [userId, questId], function(err) {
        if (err == null) {
            console.log(`Inserted user to quest ${userId} quest: ${questId}`)
            callback()
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
            callback(rows)
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
    db.all('SELECT ua.questId FROM UserQuest WHERE userId = ?', [userId], function(err, rows) {
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

function loadUsersToDatabase() {
    for (var i = 0, len = bot.users.length; i < len; i++) {
        database.getUser(user, function(savedUsers) {
            if (savedUsers.length == 0) {
                bot.users.info({
                    user: user
                }, function(err, info) {
                    var newUser = new Object()
                    newUser.id = user.id
                    newUser.fullName = info.user.fullName
                    newUser.level = 1
                    newUser.roleID = "Hero"
                    newUser.xp = 0
                    database.upsertUser(newUser, function() {
                    })
                })
            }
        })
    }
}
