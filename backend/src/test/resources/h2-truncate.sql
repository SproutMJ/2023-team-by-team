SET REFERENTIAL_INTEGRITY FALSE;

TRUNCATE TABLE TOKEN;
TRUNCATE TABLE MEMBER;
TRUNCATE TABLE SCHEDULE;
TRUNCATE TABLE MEMBER_TEAM_PLACE;
TRUNCATE TABLE TEAM_PLACE;
TRUNCATE TABLE SCHEDULE_NOTIFICATION;
TRUNCATE TABLE SHARED_LINK_NOTIFICATION;
TRUNCATE TABLE FEED_THREAD;
TRUNCATE TABLE FEED_THREAD_IMAGE;
TRUNCATE TABLE NOTICE;
TRUNCATE TABLE NOTICE_IMAGE;
TRUNCATE TABLE FEED;
TRUNCATE TABLE TEAM_PLACE_INVITE_CODE;
TRUNCATE TABLE SHARED_LINK;
TRUNCATE TABLE PUBLISHED_ICALENDAR;

SET REFERENTIAL_INTEGRITY TRUE;
