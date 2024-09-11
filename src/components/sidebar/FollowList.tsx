import { useState, useEffect } from "react";
import {
  getFollowingInfo,
  getFollowerInfo,
  deleteFollower,
  FollowInfo,
  acceptFollower,
  getUserInfo,
  UserInfo,
} from "api/users";
import baseProfile from "assets/baseProfile.png";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { SideBarAtom } from "store/SideBarAtom";

const FollowWrapper = styled.div`
  width: 100%;
  padding: 10px 0px;
  box-sizing: border-box;
`;

const FollowingWrapper = styled.div`
  width: 100%;
  margin-bottom: 30px;

  h1 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      img#profile {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: 2px solid #333;
        margin-right: 15px;
      }

      div#name {
        flex-grow: 1;

        h2 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }

        p {
          margin: 5px 0 0;
          font-size: 14px;
          color: #666;
        }
      }
    }
  }
`;

const FollowerWrapper = styled.div`
  h1 {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      img#profile {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        border: 2px solid #333;
        margin-right: 15px;
      }

      div {
        flex-grow: 1;

        h2 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }
      }

      button {
        margin-left: 10px;
        padding: 5px 8px;
        font-size: 14px;
        color: #fff;
        background-color: #007bff;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #0056b3;
        }

        &:first-of-type {
          background-color: #fff; /* 수락 버튼을 흰색으로 변경 */
          color: #000; /* 텍스트 색상을 검정색으로 변경 */
          border: 2px solid #000; /* 테두리를 추가하여 버튼을 강조 */
        }

        &:last-of-type {
          background-color: #dc3545; /* 거절 버튼을 빨강색으로 */
          border: 2px solid #dc3545;
        }
      }
    }
  }
`;

export default function FollowList() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [followingInfo, setFollowingInfo] = useState<FollowInfo[]>([]);
  const [followerInfo, setFollowerInfo] = useState<FollowInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [xPosition, setX] = useRecoilState(SideBarAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
        console.log(userInfo, "1");
      } catch (error) {
        setError("Failed to fetch user info");
      }
    };
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchFollowingInfo = async () => {
        try {
          const followingData = await getFollowingInfo(user.id.toString());
          setFollowingInfo(followingData);
        } catch (error) {
          setError("Failed to fetch following info");
        }
      };
      fetchFollowingInfo();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchFollowerInfo = async () => {
        try {
          const followerData = await getFollowerInfo(user.id.toString());
          setFollowerInfo(followerData);
        } catch (error) {
          setError("Failed to fetch follower info");
        }
      };
      fetchFollowerInfo();
    }
  }, [user]);

  const handleAcceptFollower = async (followerId: number) => {
    try {
      await acceptFollower(followerId.toString());
      if (user) {
        const updatedFollowerInfo = await getFollowerInfo(user.id.toString());
        setFollowerInfo(updatedFollowerInfo);
      }
    } catch (error) {
      setError("Failed to accept follower");
    }
  };

  const handleDeleteFollower = async (followerId: number) => {
    try {
      await deleteFollower(followerId);
      if (user) {
        const updatedFollowerInfo = await getFollowerInfo(user.id.toString());
        setFollowerInfo(updatedFollowerInfo);
      }
    } catch (error) {
      setError("Failed to delete follower");
    }
  };

  const handleItemClick = (id: number) => {
    setX(-xPosition);
    navigate(`/following/${id}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <FollowWrapper>
      {user && (
        <div>
          <FollowingWrapper>
            <h1 id="header"> 팔로잉 </h1>
            {Array.isArray(followingInfo) && followingInfo.length > 0 ? (
              <ul>
                {followingInfo.map((follow) => (
                  <li
                    key={follow.id}
                    onClick={() => handleItemClick(follow.id)}
                  >
                    <img
                      id="profile"
                      src={follow.image ? follow.image : baseProfile}
                      alt={follow.name}
                    />
                    <div id="name">
                      <h2>{follow.name}</h2>
                      <p>{follow.introduction}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No followers found.</p>
            )}
          </FollowingWrapper>

          <FollowerWrapper>
            <h1> 팔로우 요청 </h1>
            {Array.isArray(followerInfo) && followerInfo.length > 0 ? (
              <ul>
                {followerInfo.map((follow) => (
                  <li key={follow.id}>
                    <img
                      id="profile"
                      src={follow.image ? follow.image : baseProfile}
                      alt={follow.name}
                    />
                    <div>
                      <h2>{follow.name}</h2>
                    </div>
                    <button onClick={() => handleAcceptFollower(follow.id)}>
                      Accept
                    </button>
                    <button onClick={() => handleDeleteFollower(follow.id)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No followers found.</p>
            )}
          </FollowerWrapper>
        </div>
      )}
    </FollowWrapper>
  );
}
