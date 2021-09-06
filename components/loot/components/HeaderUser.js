import React from "react"
import User from "./User"

function HeaderUser({user, currentUser, provider, efd, refreshUser, refreshCurrentUser}) {
    
    let isOwnProfile = currentUser && user.address.toLowerCase() === currentUser.address.toLowerCase()
 

    return <div className="headerUser">
        <div style={{display: "flex"}}>
            <div style={{ display: "inline-block", alignItems: "flex-start"}}>
                <User user={user} addressCopyable={true} miscText={isOwnProfile ? "You" : undefined}></User>
            </div>            
        </div>
    </div>
}

export default HeaderUser