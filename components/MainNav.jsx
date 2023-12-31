import React, { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { addToHistory } from "@/lib/userData";
import { readToken, removeToken } from "@/lib/authenticate";

export default function MainNav() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  // Used to set the search field value to empty
  const searchTextRef = useRef(null);
  const navbarRef = useRef(null);
  // Store the current value of tokens
  let token = readToken();

  // Collapses the navbar on small devices when user click anywhere outside it
  const handleOutsideClick = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  // Logs the user out
  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push("/login");
  }

  // Collapses the navbar when clicked outside
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isExpanded]);

  // When the user clicks on the search button, the form is submitted and the app redirects the user to the custom URL requested
  async function handleSubmit(event) {
    event.preventDefault();
    setIsExpanded(false);
    if (searchText.trim() != "") {
      setSearchHistory(await addToHistory(`title=true&q=${searchText}`));
      router.push(`/artwork?title=true&q=${searchText}`);
    }
    setSearchText("");
    searchTextRef.current.value = "";
  }

  return (
    <>
      <Navbar
        ref={navbarRef}
        expand="lg"
        className="bg-dark navbar-dark fixed-top nav-bar"
        expanded={isExpanded}
      >
        <Container>
          <Navbar.Brand>Aryan Khurana</Navbar.Brand>
          <Navbar.Toggle
            onClick={() => setIsExpanded(!isExpanded)}
            aria-controls="navbarScroll"
          />
          <Navbar.Collapse id="navbarScroll">
            {/* Different UI depending on whether the token exists or not */}
            {token ? (
              <>
                <Nav
                  className="me-auto my-2 my-lg-0"
                  style={{ maxHeight: "100px" }}
                  navbarScroll
                >
                  <Link href="/" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === "/"}
                      onClick={() => setIsExpanded(false)}
                    >
                      Home
                    </Nav.Link>
                  </Link>
                  <Link href="/search" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === "/search"}
                      onClick={() => setIsExpanded(false)}
                    >
                      Advanced Search{" "}
                    </Nav.Link>
                  </Link>
                </Nav>
                &nbsp;
                <Form className="d-flex" onSubmit={handleSubmit}>
                  <Form.Control
                    ref={searchTextRef}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                    }}
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    aria-label="Search"
                  />
                  <Button type="submit" variant="outline-success">
                    Search
                  </Button>
                </Form>
                &nbsp;
                <Nav>
                  <NavDropdown title={token.userName} id="basic-nav-dropdown">
                    <Link href="/favourites" passHref legacyBehavior>
                      <Nav.Link>
                        <NavDropdown.Item
                          active={router.pathname === "/favourites"}
                          onClick={() => setIsExpanded(false)}
                          href="#action/3.1"
                        >
                          Favourites
                        </NavDropdown.Item>
                      </Nav.Link>
                    </Link>
                    <Link href="/history" passHref legacyBehavior>
                      <Nav.Link>
                        <NavDropdown.Item
                          active={router.pathname === "/history"}
                          onClick={() => setIsExpanded(false)}
                          href="#action/3.2"
                        >
                          History
                        </NavDropdown.Item>
                      </Nav.Link>
                    </Link>
                    <Link href="/login" passHref legacyBehavior>
                      <Nav.Link>
                        <NavDropdown.Item
                          onClick={() => logout()}
                          href="#action/3.3"
                        >
                          Logout
                        </NavDropdown.Item>
                      </Nav.Link>
                    </Link>
                  </NavDropdown>
                </Nav>
              </>
            ) : (
              <>
                <Nav
                  className="me-auto my-2 my-lg-0"
                  style={{ maxHeight: "100px" }}
                  navbarScroll
                >
                  <Link href="/" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === "/"}
                      onClick={() => setIsExpanded(false)}
                    >
                      Home
                    </Nav.Link>
                  </Link>
                </Nav>
                <Nav
                  className="my-2 my-lg-0"
                  style={{ maxHeight: "100px" }}
                  navbarScroll
                >
                  <Link href="/register" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === "/register"}
                      onClick={() => setIsExpanded(false)}
                    >
                      Register
                    </Nav.Link>
                  </Link>
                  <Link href="/login" passHref legacyBehavior>
                    <Nav.Link
                      active={router.pathname === "/login"}
                      onClick={() => setIsExpanded(false)}
                    >
                      Login
                    </Nav.Link>
                  </Link>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
      <br />
    </>
  );
}
