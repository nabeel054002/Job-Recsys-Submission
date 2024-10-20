    import React from 'react';
    import Panel from './Panel'

    function JwtComponent() {
        const [user, setUser] = React.useState('')
        const getUser = async (token) => {
            const response = await fetch('http://localhost:5000/decode_jwt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jwt_token: token
                })
            })
            const username = await response.json();
            console.log('username', username)
            setUser(username.username)
        }

        React.useEffect(()=> {
            const token = window.location.href.substring(22);
            getUser(token)
        }, [])
        return (
        <div>
            {
                user ? <Panel username={user}/> : 'Login Again'
            }
        </div>
        );
    }

    export default JwtComponent;
