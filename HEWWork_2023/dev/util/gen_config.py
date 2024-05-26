import configparser


config = configparser.ConfigParser()

config["DEFAULT"] = {
    "TestUserID": "TEST_ID",
    "TestErrorUserID": "ERROR_TOKEN",
    "TestUserToken": "TEST_TOKEN",}

with open("config.ini", "w") as configfile:
    config.write(configfile)