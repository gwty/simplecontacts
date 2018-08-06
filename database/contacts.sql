--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4
-- Dumped by pg_dump version 10.4 (Ubuntu 10.4-2.pgdg16.04+1)

-- Started on 2018-08-06 03:03:49 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 197 (class 1259 OID 16386)
-- Name: contacts; Type: TABLE; Schema: contacts; Owner: postgres
--

CREATE TABLE contacts.contacts (
    id integer NOT NULL,
    first_name text,
    last_name text,
    email text,
    phone_number text,
    status boolean,
    country text,
    type text
);


ALTER TABLE contacts.contacts OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 16392)
-- Name: contacts_id_seq; Type: SEQUENCE; Schema: contacts; Owner: postgres
--

CREATE SEQUENCE contacts.contacts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE contacts.contacts_id_seq OWNER TO postgres;

--
-- TOC entry 2879 (class 0 OID 0)
-- Dependencies: 198
-- Name: contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: contacts; Owner: postgres
--

ALTER SEQUENCE contacts.contacts_id_seq OWNED BY contacts.contacts.id;


--
-- TOC entry 2748 (class 2604 OID 16394)
-- Name: contacts id; Type: DEFAULT; Schema: contacts; Owner: postgres
--

ALTER TABLE ONLY contacts.contacts ALTER COLUMN id SET DEFAULT nextval('contacts.contacts_id_seq'::regclass);


--
-- TOC entry 2872 (class 0 OID 16386)
-- Dependencies: 197
-- Data for Name: contacts; Type: TABLE DATA; Schema: contacts; Owner: postgres
--

COPY contacts.contacts (id, first_name, last_name, email, phone_number, status, country, type) FROM stdin;
74	Smith	John	john@smith.com	12345678	t	\N	\N
75	Pam	\N	pam@gmail.com	654323	t	\N	\N
73	Gowtham	Ashok	gwty93@gmail.com	222222222	t	USA	\N
\.


--
-- TOC entry 2880 (class 0 OID 0)
-- Dependencies: 198
-- Name: contacts_id_seq; Type: SEQUENCE SET; Schema: contacts; Owner: postgres
--

SELECT pg_catalog.setval('contacts.contacts_id_seq', 75, true);


--
-- TOC entry 2750 (class 2606 OID 16396)
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: contacts; Owner: postgres
--

ALTER TABLE ONLY contacts.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id);


-- Completed on 2018-08-06 03:03:49 EDT

--
-- PostgreSQL database dump complete
--

