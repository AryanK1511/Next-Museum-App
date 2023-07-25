import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import validObjectIDList from '@/public/data/validObjectIDList.json';
import useSWR from 'swr';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Error from 'next/error';
import Pagination from 'react-bootstrap/Pagination';
import Card from 'react-bootstrap/Card';
import ArtworkCard from '@/components/ArtworkCard';

const PER_PAGE = 12

export default function ArtHome() {
    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];

    // Add the artworkList and page to the state
    let [ artworkList, setArtworkList ] = useState([]);
    let [ page, setPage ] = useState(1)

    // Make a call to the museum API using the objectID passed as props to this component
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);
      
    // Create a 2D array of data for paging that is set in the state 
    useEffect(() => {
        if (data != null && data != undefined) {
            // This has the effect of eliminating objectIDs from our search results that are not in the validObjectIDList
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));
            let results = []
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }            
            setArtworkList(results);
            setPage(1);
        }
    }, [data]);

    // Throw an error if the API request fails
    if (error) {
        return <Error statusCode={404} />;
    } else {
        if (!artworkList) {
            return null;
        }
    }

    // Increase the value of page by 1
    const nextPage = () => page < artworkList.length && setPage(++page);
    
    // Decrease the value of page by 1
    const previousPage = () => page > 1 && setPage(--page);

    return (
        <>
            <Container className="justify-content-center align-items-center">
            {artworkList.length > 0 ? (
                <>
                    <Row>
                        {artworkList[page - 1].map((currentObjectID) => (
                            <Col xl={3} lg={4} md={6} sm={12} key={currentObjectID} className="d-flex justify-content-center">
                    <ArtworkCard objectID={currentObjectID} />
                            </Col>
                        ))}
                    </Row>
                    <Row>
                        <Col>
                            <br /><br />
                            <Pagination>
                                <Pagination.Prev onClick={previousPage} />
                                <Pagination.Item>{page}</Pagination.Item>
                                <Pagination.Next onClick={nextPage} />
                            </Pagination>
                        </Col>
                    </Row>
                </>
                ) : (
                <Card>
                    <Card.Body>
                    <h4>Nothing Here</h4>
                    <p>Try searching for something else.</p>
                    </Card.Body>
                </Card>
                )}
            </Container>
        </>
    );
}