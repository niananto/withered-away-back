CREATE OR REPLACE TRIGGER AUTO_DIAGNOSED_BY
AFTER INSERT ON SUBSCRIPTION
FOR EACH ROW
DECLARE
	E_PEOPLE_ID NUMBER;
	E_MEMBERSHIP_ID NUMBER;
	E_COUNT_PATIENTS NUMBER;
	E_DOC_COUNT NUMBER;
	E_PEOPLE_COUNT NUMBER;
	E_DOC_PEOPLE_RATIO NUMBER;
BEGIN
	E_PEOPLE_ID := :NEW.PEOPLE_ID;
	E_MEMBERSHIP_ID := :NEW.MEMBERSHIP_ID;
	SELECT COUNT(*) INTO E_DOC_COUNT FROM DOCTOR;
	SELECT COUNT(*) INTO E_PEOPLE_COUNT FROM PEOPLE;
	E_DOC_PEOPLE_RATIO := E_PEOPLE_COUNT / E_DOC_COUNT;
	DBMS_OUTPUT.PUT_LINE(E_DOC_PEOPLE_RATIO);
	IF E_MEMBERSHIP_ID = 1 OR E_MEMBERSHIP_ID = 2 THEN
		FOR D IN (SELECT * FROM DOCTOR ORDER BY FEE DESC)
		LOOP
			SELECT COUNT(*) INTO E_COUNT_PATIENTS FROM DIAGNOSED_BY DB WHERE DB.DOCTOR_ID=D.ID;
			IF E_COUNT_PATIENTS <= E_DOC_PEOPLE_RATIO THEN
				INSERT INTO DIAGNOSED_BY (PEOPLE_ID, DOCTOR_ID) VALUES (E_PEOPLE_ID, D.ID);
				EXIT;
			END IF; 
		END LOOP;
	ELSE
		FOR D IN (SELECT * FROM DOCTOR ORDER BY FEE ASC)
		LOOP
			SELECT COUNT(*) INTO E_COUNT_PATIENTS FROM DIAGNOSED_BY DB WHERE DB.DOCTOR_ID=D.ID;
			IF E_COUNT_PATIENTS <= E_DOC_PEOPLE_RATIO THEN
				INSERT INTO DIAGNOSED_BY (PEOPLE_ID, DOCTOR_ID) VALUES (E_PEOPLE_ID, D.ID);
				EXIT;
			END IF; 
		END LOOP;
	END IF;
END;
/

---------------------------------------------------------

CREATE OR REPLACE TRIGGER AUTO_ROOM_ALLOTMENT
AFTER INSERT ON PEOPLE
FOR EACH ROW
DECLARE
	CURR_PEOPLE_ID NUMBER;
	CURR_CAPACITY NUMBER;
	CURR_COUNT NUMBER;
BEGIN
	CURR_PEOPLE_ID := :NEW.ID;
	FOR BR IN (SELECT * FROM BED_ROOM)
	LOOP
		SELECT CAPACITY INTO CURR_CAPACITY FROM ROOM R WHERE R.ID=BR.ROOM_ID;
		SELECT COUNT(*) INTO CURR_COUNT FROM BED_ROOM WHERE ROOM_ID=BR.ROOM_ID;
		IF CURR_COUNT < CURR_CAPACITY THEN
			INSERT INTO ROOM_ALLOTMENT
			(ROOM_ID, PEOPLE_ID)
			VALUES
			(BR.ROOM_ID, CURR_PEOPLE_ID);
			EXIT;
		END IF;
	END LOOP;
END;
/

------------------------------

CREATE OR REPLACE TRIGGER AUTO_PEOPLE_BACKUP
AFTER DELETE ON PEOPLE
FOR EACH ROW
DECLARE
	P_ID NUMBER;
	P_NAME VARCHAR2(50);
	P_GENDER VARCHAR2(20);
	P_BIRTHDAY DATE;
	P_phone_no VARCHAR2(15);
BEGIN
	P_ID := :OLD.ID;
	P_NAME := :OLD.NAME;
	P_GENDER := :OLD.GENDER;
	P_BIRTHDAY := :OLD.BIRTHDAY;
	P_phone_no := :OLD.phone_no;
	
	INSERT INTO DELETED_PEOPLE
	(ID, NAME, GENDER, BIRTHDAY, phone_no, DELETED_ON)
	VALUES
	(P_ID, P_NAME, P_GENDER, P_BIRTHDAY, P_phone_no, SYSDATE);
END;
/

-------------------------------

CREATE OR REPLACE TRIGGER AUTO_DOCTOR_BACKUP
AFTER DELETE ON DOCTOR
FOR EACH ROW
DECLARE
	D_ID NUMBER;
	D_NAME VARCHAR2(50);
	D_QUALIFICATION VARCHAR2(150);
	D_hospital_name VARCHAR2(50);
	D_phone_no VARCHAR2(15);
	D_email_address VARCHAR2(30);
	D_fee numeric(8,2);
	DELETED_ON DATE;
BEGIN
	D_ID := :OLD.ID;
	D_NAME := :OLD.NAME;
	D_QUALIFICATION := :OLD.QUALIFICATION;
	D_HOSPITAL_NAME := :OLD.HOSPITAL_NAME;
	D_PHONE_NO := :OLD.PHONE_NO;
	D_EMAIL_ADDRESS := :OLD.EMAIL_ADDRESS;
	D_FEE := :OLD.FEE;
	
	INSERT INTO DELETED_DOCTOR
	(ID, NAME, QUALIFICATION, HOSPITAL_NAME, PHONE_NO, EMAIL_ADDRESS, FEE, DELETED_ON)
	VALUES
	(D_ID, D_NAME, D_QUALIFICATION, D_HOSPITAL_NAME, D_PHONE_NO, D_EMAIL_ADDRESS, D_FEE, SYSDATE);
END;
/

--------------------------

CREATE OR REPLACE TRIGGER AUTO_STAFF_BACKUP
AFTER DELETE ON STAFF
FOR EACH ROW
DECLARE
	S_ID NUMBER;
	S_NAME VARCHAR2(50);
	S_BIRTHDATE DATE;
	S_SALARY NUMERIC(8,2);
BEGIN
	S_ID := :OLD.ID;
	S_NAME := :OLD.NAME;
	S_BIRTHDATE := :OLD.BIRTHDATE;
	S_SALARY := :OLD.SALARY;
	
	INSERT INTO DELETED_STAFF
	(ID, NAME, BIRTHDATE, SALARY, DELETED_ON)
	VALUES
	(S_ID, S_NAME, S_BIRTHDATE, S_SALARY, SYSDATE);
END;
/

-------------------------------------------

CREATE OR REPLACE TRIGGER RETURN_DOCTOR_FEE_ON_APPOINTMENT_DELETE
AFTER DELETE ON APPOINTMENT
FOR EACH ROW
DECLARE
	D_ID NUMBER;
	P_ID NUMBER;
	C_FEE NUMBER;
	C_BALANCE NUMBER;
	C_DNAME VARCHAR2(100);
	C_BANKNO VARCHAR2(50);
	C_TDETAILS VARCHAR2(1000);
	C_TTYPE VARCHAR2(50);
	C_INOUT VARCHAR2(10);
BEGIN
	P_ID := :OLD.PEOPLE_ID;
	D_ID := :OLD.DOCTOR_ID;
	
	SELECT FEE INTO C_FEE FROM DOCTOR WHERE ID=D_ID;
	SELECT BALANCE INTO C_BALANCE FROM ACCOUNT WHERE PEOPLE_ID=P_ID;
	C_BALANCE := C_BALANCE + C_FEE;
	UPDATE ACCOUNT SET BALANCE=C_BALANCE WHERE PEOPLE_ID=P_ID;
		
	SELECT NAME INTO C_DNAME FROM DOCTOR WHERE ID=D_ID;
	SELECT BANK_ACCOUNT_NO INTO C_BANKNO FROM ACCOUNT WHERE PEOPLE_ID=P_ID;
	C_TDETAILS := 'Rejected your requested Appointment : ' || C_DNAME;
	C_TTYPE := 'REJECTING APPOINTMENT';
	C_INOUT := 'IN';
	
	INSERT INTO TRANSACTIONS (BANK_ACCOUNT_NO, PEOPLE_ID, TRX_TYPE, DETAILS, TRX_DATE, AMOUNT, IN_OUT)
	VALUES (C_BANKNO, P_ID, C_TTYPE, C_TDETAILS, SYSDATE, C_FEE, C_INOUT);
END;
/