--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-03-21 01:34:16

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "SimpleInvoices";
--
-- TOC entry 4847 (class 1262 OID 16388)
-- Name: SimpleInvoices; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "SimpleInvoices" WITH TEMPLATE = template0 ENCODING = 'UTF8';


ALTER DATABASE "SimpleInvoices" OWNER TO postgres;

\connect "SimpleInvoices"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4848 (class 0 OID 0)
-- Name: SimpleInvoices; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE "SimpleInvoices" CONNECTION LIMIT = 5;


\connect "SimpleInvoices"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16410)
-- Name: clients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clients (
    clientid integer NOT NULL,
    userid integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    address text
);


ALTER TABLE public.clients OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16409)
-- Name: clients_clientid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clients_clientid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clients_clientid_seq OWNER TO postgres;

--
-- TOC entry 4849 (class 0 OID 0)
-- Dependencies: 219
-- Name: clients_clientid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clients_clientid_seq OWNED BY public.clients.clientid;


--
-- TOC entry 223 (class 1259 OID 16498)
-- Name: invoices_invoiceid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_invoiceid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_invoiceid_seq OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16522)
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    invoiceid integer DEFAULT nextval('public.invoices_invoiceid_seq'::regclass) NOT NULL,
    userid integer NOT NULL,
    clientid integer NOT NULL,
    status character varying(50) NOT NULL,
    currency character varying(10) NOT NULL,
    language character varying(20) NOT NULL,
    date date DEFAULT CURRENT_DATE NOT NULL,
    notes text,
    discount numeric(10,2) DEFAULT 0.00,
    salestax numeric(10,2),
    secondtax numeric(10,2),
    acceptcreditcards boolean DEFAULT false,
    acceptpaypal boolean DEFAULT false,
    subscriptionid integer,
    products jsonb DEFAULT '[]'::jsonb NOT NULL,
    CONSTRAINT invoices_language_check CHECK (((language)::text = ANY ((ARRAY['Polski'::character varying, 'English'::character varying, 'Deutsch'::character varying, 'Français'::character varying])::text[]))),
    CONSTRAINT invoices_status_check CHECK (((status)::text = ANY (ARRAY[('Draft'::character varying)::text, ('Sent'::character varying)::text, ('Paid'::character varying)::text, ('Refunded'::character varying)::text, ('Deleted'::character varying)::text])))
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16480)
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    logid integer NOT NULL,
    userid integer NOT NULL,
    action text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16479)
-- Name: logs_logid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_logid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_logid_seq OWNER TO postgres;

--
-- TOC entry 4850 (class 0 OID 0)
-- Dependencies: 221
-- Name: logs_logid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_logid_seq OWNED BY public.logs.logid;


--
-- TOC entry 226 (class 1259 OID 24778)
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    subscriptionid integer NOT NULL,
    userid integer NOT NULL,
    clientid integer NOT NULL,
    currency character varying(10) NOT NULL,
    language character varying(10) NOT NULL,
    notes text,
    discount numeric(10,2),
    salestax numeric(10,2),
    secondtax numeric(10,2),
    acceptcreditcards boolean DEFAULT false NOT NULL,
    acceptpaypal boolean DEFAULT false NOT NULL,
    start_date date NOT NULL,
    frequency character varying(20) NOT NULL,
    end_date date,
    status character varying(20) NOT NULL,
    next_invoice date,
    products jsonb DEFAULT '[]'::jsonb NOT NULL,
    CONSTRAINT subscriptions_frequency_check CHECK (((frequency)::text = ANY (ARRAY[('Weekly'::character varying)::text, ('Every 2 weeks'::character varying)::text, ('Every 4 weeks'::character varying)::text, ('Monthly'::character varying)::text, ('Quarterly'::character varying)::text, ('Every 6 months'::character varying)::text, ('Yearly'::character varying)::text]))),
    CONSTRAINT subscriptions_status_check CHECK (((status)::text = ANY (ARRAY[('Active'::character varying)::text, ('Paused'::character varying)::text, ('Deleted'::character varying)::text])))
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24777)
-- Name: subscriptions_subscriptionid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subscriptions_subscriptionid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subscriptions_subscriptionid_seq OWNER TO postgres;

--
-- TOC entry 4851 (class 0 OID 0)
-- Dependencies: 225
-- Name: subscriptions_subscriptionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subscriptions_subscriptionid_seq OWNED BY public.subscriptions.subscriptionid;


--
-- TOC entry 218 (class 1259 OID 16396)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    login_method character varying(20) NOT NULL,
    isverified boolean DEFAULT false NOT NULL,
    payment1 character varying(255),
    payment2 character varying(255),
    default_currency character varying(10),
    default_language character varying(10),
    CONSTRAINT password_required CHECK (((((login_method)::text = 'credentials'::text) AND (password IS NOT NULL)) OR (((login_method)::text = 'google'::text) AND (password IS NULL)))),
    CONSTRAINT users_login_method_check CHECK (((login_method)::text = ANY ((ARRAY['credentials'::character varying, 'google'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16395)
-- Name: users_userid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_userid_seq OWNER TO postgres;

--
-- TOC entry 4852 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_userid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_userid_seq OWNED BY public.users.userid;


--
-- TOC entry 4658 (class 2604 OID 16413)
-- Name: clients clientid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients ALTER COLUMN clientid SET DEFAULT nextval('public.clients_clientid_seq'::regclass);


--
-- TOC entry 4659 (class 2604 OID 16483)
-- Name: logs logid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs ALTER COLUMN logid SET DEFAULT nextval('public.logs_logid_seq'::regclass);


--
-- TOC entry 4667 (class 2604 OID 24781)
-- Name: subscriptions subscriptionid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN subscriptionid SET DEFAULT nextval('public.subscriptions_subscriptionid_seq'::regclass);


--
-- TOC entry 4656 (class 2604 OID 16399)
-- Name: users userid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN userid SET DEFAULT nextval('public.users_userid_seq'::regclass);


--
-- TOC entry 4682 (class 2606 OID 16419)
-- Name: clients clients_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_email_key UNIQUE (email);


--
-- TOC entry 4684 (class 2606 OID 16417)
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (clientid);


--
-- TOC entry 4688 (class 2606 OID 16535)
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (invoiceid);


--
-- TOC entry 4686 (class 2606 OID 16488)
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (logid);


--
-- TOC entry 4690 (class 2606 OID 24789)
-- Name: subscriptions subscriptions_new_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_new_pkey PRIMARY KEY (subscriptionid);


--
-- TOC entry 4678 (class 2606 OID 16408)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4680 (class 2606 OID 16406)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- TOC entry 4691 (class 2606 OID 16420)
-- Name: clients clients_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- TOC entry 4695 (class 2606 OID 24795)
-- Name: subscriptions fk_clients; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fk_clients FOREIGN KEY (clientid) REFERENCES public.clients(clientid) ON DELETE CASCADE;


--
-- TOC entry 4696 (class 2606 OID 24790)
-- Name: subscriptions fk_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fk_users FOREIGN KEY (userid) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- TOC entry 4693 (class 2606 OID 16536)
-- Name: invoices invoices_clientid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_clientid_fkey FOREIGN KEY (clientid) REFERENCES public.clients(clientid) ON DELETE CASCADE;


--
-- TOC entry 4694 (class 2606 OID 16541)
-- Name: invoices invoices_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid) ON DELETE CASCADE;


--
-- TOC entry 4692 (class 2606 OID 16489)
-- Name: logs logs_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid) ON DELETE CASCADE;


-- Completed on 2025-03-21 01:34:16

--
-- PostgreSQL database dump complete
--

