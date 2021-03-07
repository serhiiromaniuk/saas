package database

import (
	// "fmt"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/serhiiromaniuk/saas/backend/database/migrations"
)

// Database function
func Database() {
	fmt.Println("=====> Starting GORM migrations")
	dbConnector()
	fmt.Println("=====> Ending GORM migrations")
}

func dbConnector() {
	loadEnv := godotenv.Load(".env")

	if loadEnv != nil {
	  log.Fatalf("Error loading .env file.\n%s", loadEnv)
	}

	config := os.Getenv("MYSQL_USER") + 
	":" +
	os.Getenv("MYSQL_PASSWORD") +
	"@tcp(" + os.Getenv("MYSQL_HOST") + ":" + os.Getenv("MYSQL_PORT") + ")" + "/" +
	os.Getenv("MYSQL_DATABASE")

	loggerConfig := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
		  SlowThreshold: time.Second,   
		  LogLevel:      logger.Info, 
		  Colorful:      true })

	db, err := gorm.Open(mysql.New(mysql.Config{
		DSN: config,
		DefaultStringSize: 128,
		DontSupportRenameIndex: true,
		SkipInitializeWithVersion: false }), &gorm.Config{
			Logger: loggerConfig,
			SkipDefaultTransaction: true })

	if err != nil {
		log.Fatalf("Error connecting database.\n%s", err)
	}
	
	db.AutoMigrate(migrations.Models...)
	// db.Model(migrations.Models).AddForeignKey("user_id", "user_users(id)", "RESTRICT", "RESTRICT")
}

// func handleRequests() {
// 	myRouter := mux.NewRouter().StrictSlash(true)
// 	myRouter.HandleFunc("/users", allUsers).Methods("GET")
// 	myRouter.HandleFunc("/user/{name}", deleteUser).Methods("DELETE")
// 	myRouter.HandleFunc("/user/{name}/{email}", updateUser).Methods("PUT")
// 	myRouter.HandleFunc("/user/{name}/{email}", newUser).Methods("POST")
// 	myRouter.HandleFunc("/user/{name}/{email}/{message}", updateUser).Methods("PUT")
// 	myRouter.HandleFunc("/user/{name}/{email}/{message}", newUser).Methods("POST")
// 	log.Fatal(http.ListenAndServe(":8081", myRouter))
//  }
