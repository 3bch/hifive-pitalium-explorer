
\c true

\p ******* DROP TABLE START *******

DROP TABLE ProcessedImage;
DROP TABLE ScreenshotDifference;
DROP TABLE Screenshot;
DROP TABLE TestEnvironment;
DROP TABLE TestExecution;

\p ******* DROP TABLE END *******

\p ******* DROP SEQUENCE START *******

DROP SEQUENCE Seq_Screenshot;
DROP SEQUENCE Seq_TestEnvironment;
DROP SEQUENCE Seq_TestExecution;

\p ******* DROP SEQUENCE END *******

\c false

\p ******* CREATE SEQUENCE START *******

CREATE SEQUENCE Seq_TestExecution AS INTEGER START WITH 1;
CREATE SEQUENCE Seq_TestEnvironment AS INTEGER START WITH 1;
CREATE SEQUENCE Seq_Screenshot AS INTEGER START WITH 1;

\p ******* CREATE SEQUENCE END *******

\p ******* CREATE TABLE START *******

CREATE TABLE TestExecution (
	id INTEGER GENERATED BY DEFAULT AS SEQUENCE Seq_TestExecution,
	label VARCHAR(100),
	time TIMESTAMP(2) WITH TIME ZONE NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE TestEnvironment (
	id INTEGER GENERATED BY DEFAULT AS SEQUENCE Seq_TestEnvironment,
	label VARCHAR(100),
	platform VARCHAR(100),
	platformVersion VARCHAR(100),
	deviceName VARCHAR(100),
	browserName VARCHAR(100),
	browserVersion VARCHAR(100),
	PRIMARY KEY (id)
);

CREATE TABLE Screenshot (
	id INTEGER GENERATED BY DEFAULT AS SEQUENCE Seq_Screenshot,
	expectedId INTEGER,
	fileName VARCHAR(260) NOT NULL,
	comparisonResult BOOLEAN,
	testClass VARCHAR(100) NOT NULL,
	testMethod VARCHAR(100) NOT NULL,
	testScreen VARCHAR(100) NOT NULL,
	testExecutionId INTEGER NOT NULL,
	testEnvironmentId INTEGER NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (expectedId) REFERENCES Screenshot (id),
	FOREIGN KEY (testExecutionId) REFERENCES TestExecution (id),
	FOREIGN KEY (testEnvironmentId) REFERENCES TestEnvironment (id)
);

CREATE TABLE ScreenshotDifference (
	screenshotId INTEGER NOT NULL,
	type VARCHAR(100) NOT NULL,
	data VARCHAR(100) NOT NULL,
	PRIMARY KEY (screenshotId, type),
	FOREIGN KEY (screenshotId) REFERENCES Screenshot (id)
);

CREATE TABLE ProcessedImage (
	screenshotId INTEGER NOT NULL,
	algorithm VARCHAR(100) NOT NULL,
	fileName VARCHAR(260) NOT NULL,
	PRIMARY KEY (screenshotId, algorithm),
	FOREIGN KEY (screenshotId) REFERENCES Screenshot (id)
);

\p ******* CREATE TABLE END *******

\p ******* CREATE INDEX START *******

CREATE INDEX Idx_TestExecutionTime ON TestExecution (time);

\p ******* CREATE INDEX END *******
