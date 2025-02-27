--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Debian 15.8-0+deb12u1)
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: ken
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO ken;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: ken
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administrators; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.administrators (
    id character varying(32) NOT NULL,
    division_id character varying(32),
    role character varying(255),
    fullname character varying(255),
    password character varying(255),
    username character varying(255)
);


ALTER TABLE public.administrators OWNER TO vsu;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.announcements (
    id character varying(32) NOT NULL,
    content_id character varying(32),
    message text
);


ALTER TABLE public.announcements OWNER TO vsu;

--
-- Name: attended_queue; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.attended_queue (
    id character varying(32) NOT NULL,
    desk_id character varying(32),
    queue_id character varying(32),
    attended_on timestamp without time zone,
    finished_on timestamp without time zone,
    status character varying(255)
);


ALTER TABLE public.attended_queue OWNER TO vsu;

--
-- Name: client_intents; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.client_intents (
    id character varying(32) NOT NULL,
    queue_id character varying(32),
    service_id character varying(32)
);


ALTER TABLE public.client_intents OWNER TO vsu;

--
-- Name: client_reviews; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.client_reviews (
    id character varying(32) NOT NULL,
    terminal_id character varying(32),
    queue_id character varying(32),
    field character varying(255)
);


ALTER TABLE public.client_reviews OWNER TO vsu;

--
-- Name: contents; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.contents (
    id character varying(32) NOT NULL,
    division_id character varying(32),
    logo character varying(255),
    video character varying(255),
    background character varying(255),
    timezone character varying(255),
    weather_location character varying(255),
    currency boolean
);


ALTER TABLE public.contents OWNER TO vsu;

--
-- Name: desk_attendants; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.desk_attendants (
    id character varying(32) NOT NULL,
    fullname character varying(255),
    username character varying(255),
    password character varying(255)
);


ALTER TABLE public.desk_attendants OWNER TO vsu;

--
-- Name: divisions; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.divisions (
    id character varying(32) NOT NULL,
    name character varying(255),
    description text
);


ALTER TABLE public.divisions OWNER TO vsu;

--
-- Name: logs; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.logs (
    id character varying(32) NOT NULL,
    division_id character varying(32),
    event text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.logs OWNER TO vsu;

--
-- Name: queue; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.queue (
    id character varying(32) NOT NULL,
    division_id character varying(32),
    number integer,
    status character varying(255),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    type character varying(255),
    fullname character varying(255),
    department character varying(255)
);


ALTER TABLE public.queue OWNER TO vsu;

--
-- Name: services; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.services (
    id character varying(32) NOT NULL,
    division_id character varying(32),
    name character varying(255),
    description text
);


ALTER TABLE public.services OWNER TO vsu;

--
-- Name: terminals; Type: TABLE; Schema: public; Owner: vsu
--

CREATE TABLE public.terminals (
    id character varying(32) NOT NULL,
    division_id character varying(32),
    desk_attendant_id character varying(32),
    number integer,
    in_maintenance boolean
);


ALTER TABLE public.terminals OWNER TO vsu;

--
-- Data for Name: administrators; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.administrators (id, division_id, role, fullname, password, username) FROM stdin;
1234567890abcdef1234567890abcde1	a1b2c3d4e5f6g7h8i9j0klmnopqrst12	superadmin	John Doe	$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K	jdoe
abcdef1234567890abcdef123456789b	b2c3d4e5f6g7h8i9j0klmnopqrstuvw3	registrar	Jane Smith	$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K	jsmith
7890abcdef1234567890abcdef12345c	d4e5f6g7h8i9j0klmnopqrstuvwxyza5	accountant	Mark Johnson	$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K	mjohnson
567890abcdef1234567890abcdef123d	c3d4e5f6g7h8i9j0klmnopqrstuvwxy4	cashier	Emily Davis	$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K	edavis
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.announcements (id, content_id, message) FROM stdin;
abcdefabcdefabcdefabcdefabcdef87	abcdefabcdefabcdefabcdefabcdef99	System will be down for maintenance
123456abcdefabcdefabcdefabcdef76	123456abcdefabcdefabcdefabcdef45	New service available
\.


--
-- Data for Name: attended_queue; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.attended_queue (id, desk_id, queue_id, attended_on, finished_on, status) FROM stdin;
abcdefabcdefabcdefabcdefabcdef32	abcdefabcdefabcdefabcdefabcdef78	abcdefabcdefabcdefabcdefabcdef65	2024-10-08 09:30:00	2024-10-08 09:45:00	Completed
123456abcdefabcdefabcdefabcdef21	123456abcdefabcdefabcdefabcdef12	123456abcdefabcdefabcdefabcdef54	2024-10-08 10:00:00	2024-10-08 10:20:00	Pending
\.


--
-- Data for Name: client_intents; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.client_intents (id, queue_id, service_id) FROM stdin;
abcdefabcdefabcdefabcdefabcdef19	abcdefabcdefabcdefabcdefabcdef78	abcdefabcdefabcdefabcdefabcdef01
123456abcdefabcdefabcdefabcdef09	123456abcdefabcdefabcdefabcdef12	123456789012345678901234567890f2
\.


--
-- Data for Name: client_reviews; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.client_reviews (id, terminal_id, queue_id, field) FROM stdin;
abcdefabcdefabcdefabcdefabcdef90	abcdefabcdefabcdefabcdefabcdef78	abcdefabcdefabcdefabcdefabcdef65	Good service
123456abcdefabcdefabcdefabcdef78	123456abcdefabcdefabcdefabcdef12	123456abcdefabcdefabcdefabcdef54	Needs improvement
\.


--
-- Data for Name: contents; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.contents (id, division_id, logo, video, background, timezone, weather_location, currency) FROM stdin;
abcdefabcdefabcdefabcdefabcdef99	a1b2c3d4e5f6g7h8i9j0klmnopqrst12	logo1.png	intro.mp4	blue.jpg	UTC	New York	t
123456abcdefabcdefabcdefabcdef45	b2c3d4e5f6g7h8i9j0klmnopqrstuvw3	logo2.png	tutorial.mp4	green.jpg	PST	San Francisco	f
\.


--
-- Data for Name: desk_attendants; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.desk_attendants (id, fullname, username, password) FROM stdin;
abcdefabcdef123456abcdef12345678	Alice Green	aliceg	$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K
abcdef1234567890abcdef1234567890	Bob Brown	bobb	$2y$10$CyDcWTkus.0Y.g3M.UHbdeaUC.tGOxfqDR2rZ2lmgYNVyfVzg8m5K
\.


--
-- Data for Name: divisions; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.divisions (id, name, description) FROM stdin;
a1b2c3d4e5f6g7h8i9j0klmnopqrst12	ADMINISTRATORS	Handles administrative tasks
b2c3d4e5f6g7h8i9j0klmnopqrstuvw3	REGISTRAR	Manages the registration of documents and users
c3d4e5f6g7h8i9j0klmnopqrstuvwxy4	CASH DIVISION	Handles financial transactions and payments
d4e5f6g7h8i9j0klmnopqrstuvwxyza5	ACCOUNTING	Responsible for financial reporting and analysis
\.


--
-- Data for Name: logs; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.logs (id, division_id, event, "timestamp") FROM stdin;
abcdefabcdefabcdefabcdefabcdef56	a1b2c3d4e5f6g7h8i9j0klmnopqrst12	User login	2024-10-08 09:00:00
1234abcdefabcdefabcdefabcdef123b	b2c3d4e5f6g7h8i9j0klmnopqrstuvw3	User logout	2024-10-08 09:30:00
\.


--
-- Data for Name: queue; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.queue (id, division_id, number, status, "timestamp", type, fullname, department) FROM stdin;
abcdefabcdefabcdefabcdefabcdef65	a1b2c3d4e5f6g7h8i9j0klmnopqrst12	1	active	2024-10-08 09:15:00	Standard	Michael Jordan	Customer Service
123456abcdefabcdefabcdefabcdef54	b2c3d4e5f6g7h8i9j0klmnopqrstuvw3	2	completed	2024-10-08 09:20:00	Technical	Lebron James	Technical Support
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.services (id, division_id, name, description) FROM stdin;
abcdefabcdefabcdefabcdefabcdef01	b2c3d4e5f6g7h8i9j0klmnopqrstuvw3	Request Document	Request a specific document from the system
123456789012345678901234567890f2	b2c3d4e5f6g7h8i9j0klmnopqrstuvw3	File Documents	File documents into the system
abcdef123456abcdef123456abcdef23	c3d4e5f6g7h8i9j0klmnopqrstuvwxy4	Make Payment	Make a payment through the system
1234abcdef5678901234abcdef5678g4	b2c3d4e5f6g7h8i9j0klmnopqrstuvw3	Set Appointment	Set an appointment with a department
\.


--
-- Data for Name: terminals; Type: TABLE DATA; Schema: public; Owner: vsu
--

COPY public.terminals (id, division_id, desk_attendant_id, number, in_maintenance) FROM stdin;
abcdefabcdefabcdefabcdefabcdef78	a1b2c3d4e5f6g7h8i9j0klmnopqrst12	abcdefabcdef123456abcdef12345678	101	f
123456abcdefabcdefabcdefabcdef12	b2c3d4e5f6g7h8i9j0klmnopqrstuvw3	abcdef1234567890abcdef1234567890	102	t
\.


--
-- Name: administrators administrators_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.administrators
    ADD CONSTRAINT administrators_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: attended_queue attended_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.attended_queue
    ADD CONSTRAINT attended_queue_pkey PRIMARY KEY (id);


--
-- Name: client_intents client_intents_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.client_intents
    ADD CONSTRAINT client_intents_pkey PRIMARY KEY (id);


--
-- Name: client_reviews client_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.client_reviews
    ADD CONSTRAINT client_reviews_pkey PRIMARY KEY (id);


--
-- Name: contents contents_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY (id);


--
-- Name: desk_attendants desk_attendants_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.desk_attendants
    ADD CONSTRAINT desk_attendants_pkey PRIMARY KEY (id);


--
-- Name: divisions divisions_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT divisions_pkey PRIMARY KEY (id);


--
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- Name: queue queue_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: terminals terminals_pkey; Type: CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.terminals
    ADD CONSTRAINT terminals_pkey PRIMARY KEY (id);


--
-- Name: administrators administrators_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.administrators
    ADD CONSTRAINT administrators_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE CASCADE;


--
-- Name: announcements announcements_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.contents(id) ON DELETE CASCADE;


--
-- Name: attended_queue attended_queue_desk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.attended_queue
    ADD CONSTRAINT attended_queue_desk_id_fkey FOREIGN KEY (desk_id) REFERENCES public.terminals(id) ON DELETE CASCADE;


--
-- Name: attended_queue attended_queue_queue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.attended_queue
    ADD CONSTRAINT attended_queue_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE CASCADE;


--
-- Name: client_intents client_intents_queue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.client_intents
    ADD CONSTRAINT client_intents_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE CASCADE;


--
-- Name: client_intents client_intents_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.client_intents
    ADD CONSTRAINT client_intents_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: client_reviews client_reviews_queue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.client_reviews
    ADD CONSTRAINT client_reviews_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(id) ON DELETE CASCADE;


--
-- Name: client_reviews client_reviews_terminal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.client_reviews
    ADD CONSTRAINT client_reviews_terminal_id_fkey FOREIGN KEY (terminal_id) REFERENCES public.terminals(id) ON DELETE CASCADE;


--
-- Name: contents contents_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE CASCADE;


--
-- Name: logs logs_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE CASCADE;


--
-- Name: queue queue_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.queue
    ADD CONSTRAINT queue_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE CASCADE;


--
-- Name: services services_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE CASCADE;


--
-- Name: terminals terminals_desk_attendant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.terminals
    ADD CONSTRAINT terminals_desk_attendant_id_fkey FOREIGN KEY (desk_attendant_id) REFERENCES public.desk_attendants(id) ON DELETE CASCADE;


--
-- Name: terminals terminals_division_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vsu
--

ALTER TABLE ONLY public.terminals
    ADD CONSTRAINT terminals_division_id_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: ken
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO vsu;


--
-- PostgreSQL database dump complete
--

