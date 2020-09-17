import React, { Component, Fragment } from 'react';

import Post from '../../components/Feed/Post/Post';
import Button from '../../components/Button/Button';
import FeedEdit from '../../components/Feed/FeedEdit/FeedEdit';
import Input from '../../components/Form/Input/Input';
import Paginator from '../../components/Paginator/Paginator';
import Loader from '../../components/Loader/Loader';
import ErrorHandler from '../../components/ErrorHandler/ErrorHandler';
import './Feed.css';

class Feed extends Component {
  state = {
    isEditing: false,
    posts: [],
    totalPosts: 0,
    editPost: null,
    status: '',
    postPage: 1,
    postsLoading: true,
    editLoading: false
  };

  componentDidMount() {
    const query = `{ user { status } }`
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({query})
    })
      .then(res => res.json())
      .then(resData => {
        console.log(resData);
        if (resData.errors) {
          throw new Error(
            "Fecthing status failed"
          );
        }
        this.setState({ status: resData.data.user.status });
      })
      .catch(this.catchError);

    this.loadPosts();
  }

  loadPosts = direction => {
    if (direction) {
      this.setState({ postsLoading: true, posts: [] });
    }
    let page = this.state.postPage;
    if (direction === 'next') {
      page++;
      this.setState({ postPage: page });
    }
    if (direction === 'previous') {
      page--;
      this.setState({ postPage: page });
    }
    const query = `
      query FetchPosts($page: Int) {
        posts(page: $page) {
          posts {
            _id
            title
            content
            imageUrl
            creator {
              name
            }
            createdAt
          }
          totalPosts
        }
      }
    `;
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({query, variables: { page }})
    })
      .then(res => res.json())
      .then(resData => {
        console.log(resData);
        if (resData.errors) {
          throw new Error(
            "Post fecthing failed"
          );
        }
        this.setState({
          posts: resData.data.posts.posts.map(post => {
            return {
              ...post,
              imagePath: post.imageUrl
            };
          }),
          totalPosts: resData.data.posts.totalPosts,
          postsLoading: false
        });
      })
      .catch(this.catchError);
  };

  statusUpdateHandler = event => {
    event.preventDefault();
    const query = `
      mutation UpdateUserStatus($userStatus: String!) {
        updateStatus(status: $userStatus) { status }
      }`
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({query, variables: {userStatus: this.state.status}})
    })
      .then(res => res.json())
      .then(resData => {
        console.log(resData);
        if (resData.errors) {
          throw new Error(
            "Status update failed"
          );
        }
      })
      .catch(this.catchError);
  };

  newPostHandler = () => {
    this.setState({ isEditing: true });
  };

  startEditPostHandler = postId => {
    this.setState(prevState => {
      const loadedPost = { ...prevState.posts.find(p => p._id === postId) };

      return {
        isEditing: true,
        editPost: loadedPost
      };
    });
  };

  cancelEditHandler = () => {
    this.setState({ isEditing: false, editPost: null });
  };

  finishEditHandler = postData => {
    this.setState({
      editLoading: true
    });
    const  { title, content, image } = postData;
    const formData = new FormData();
    formData.append('image', image);
    if(this.state.editPost) {
      formData.append('oldPath', this.state.editPost.imagePath);
    }
    fetch('http://localhost:8080/post-image', {
      method: 'PUT',
      body: formData,
      headers: {
        Authorization: 'Bearer ' + this.props.token
      }
    })
      .then(res => res.json())
      .then(fileInfo => {
        const imageUrl = fileInfo.filePath || 'undefined';
        let query;
        if (this.state.editPost) {
          query = { query: `
              mutation UpdatePost($id: ID!, $title: String!, $content: String!, $imageUrl: String!) {
                updatePost(
                  id: $id
                  postInput: {
                    title: $title
                    content: $content
                    imageUrl: $imageUrl
                  }
                )
                {
                  title
                  _id
                  content
                  imageUrl
                  creator { name }
                  createdAt
                }
              }`, variables: { title, content, imageUrl, id: this.state.editPost._id}};
        } else {
          query = { query: `
            mutation CreateNewPost($title: String!, $content: String!, $imageUrl: String! ) {
              createPost(postInput: {
                title: $title,
                content: $content,
                imageUrl: $imageUrl
              })
              {
                title
                _id
                content
                imageUrl
                creator { name }
                createdAt
              }
            }`, variables: { title, content, imageUrl }}
        }
        return fetch('http://localhost:8080/graphql', {
          method: 'POST',
          body: JSON.stringify(query),
          headers: {
            Authorization: 'Bearer ' + this.props.token,
            'Content-Type': 'application/json'
          }
        })
      })
      .then(res => res.json())
      .then(resData => {
        console.log(resData);
        if (resData.errors) {
          throw new Error(
            "Post creation failed"
          );
        }
        const responsePost = resData.data.createPost || resData.data.updatePost;
        const post = {
          ...responsePost,
          imageUrl: undefined,
          imagePath: responsePost.imageUrl
        }
        this.setState(prevState => {
          let updatedPosts = [...prevState.posts];
          let updatedTotalPosts = prevState.totalPosts;
          if(prevState.editPost) {
            const postIndex = prevState.posts.findIndex(
              p => p._id === prevState.editPost._id
            );
            updatedPosts[postIndex] = post;
          }else {
            updatedTotalPosts++
            if (prevState.posts.length >= 2) updatedPosts.pop();
            updatedPosts.unshift(post);
          }
          return {
            posts: updatedPosts,
            isEditing: false,
            editPost: null,
            editLoading: false,
            totalPosts: updatedTotalPosts
          };
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          isEditing: false,
          editPost: null,
          editLoading: false,
          error: err
        });
      });
  };

  statusInputChangeHandler = (input, value) => {
    this.setState({ status: value });
  };

  deletePostHandler = postId => {
    this.setState({ postsLoading: true });
    const query = `
      mutation {
        deletePost(id: "${postId}")
      }
    `
    fetch('http://localhost:8080/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({query})
    })
      .then(res => res.json())
      .then(resData => {
        console.log(resData);
        if (resData.errors) {
          throw new Error(
            "Post deletion failed"
          );
        }
        this.loadPosts();
        // this.setState(prevState => {
        //   const updatedPosts = prevState.posts.filter(p => p._id !== postId);
        //   return { posts: updatedPosts, postsLoading: false };
        // });
      })
      .catch(err => {
        console.log(err);
        this.setState({ postsLoading: false });
      });
  };

  errorHandler = () => {
    this.setState({ error: null });
  };

  catchError = error => {
    this.setState({ error: error });
  };

  render() {
    return (
      <Fragment>
        <ErrorHandler error={this.state.error} onHandle={this.errorHandler} />
        <FeedEdit
          editing={this.state.isEditing}
          selectedPost={this.state.editPost}
          loading={this.state.editLoading}
          onCancelEdit={this.cancelEditHandler}
          onFinishEdit={this.finishEditHandler}
        />
        <section className="feed__status">
          <form onSubmit={this.statusUpdateHandler}>
            <Input
              type="text"
              placeholder="Your status"
              control="input"
              onChange={this.statusInputChangeHandler}
              value={this.state.status}
            />
            <Button mode="flat" type="submit">
              Update
            </Button>
          </form>
        </section>
        <section className="feed__control">
          <Button mode="raised" design="accent" onClick={this.newPostHandler}>
            New Post
          </Button>
        </section>
        <section className="feed">
          {this.state.postsLoading && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Loader />
            </div>
          )}
          {this.state.posts.length <= 0 && !this.state.postsLoading ? (
            <p style={{ textAlign: 'center' }}>No posts found.</p>
          ) : null}
          {!this.state.postsLoading && (
            <Paginator
              onPrevious={this.loadPosts.bind(this, 'previous')}
              onNext={this.loadPosts.bind(this, 'next')}
              lastPage={Math.ceil(this.state.totalPosts / 2)}
              currentPage={this.state.postPage}
            >
              {this.state.posts.map(post => (
                <Post
                  key={post._id}
                  id={post._id}
                  author={post.creator.name}
                  date={new Date(post.createdAt).toLocaleDateString('en-US')}
                  title={post.title}
                  image={post.imageUrl}
                  content={post.content}
                  onStartEdit={this.startEditPostHandler.bind(this, post._id)}
                  onDelete={this.deletePostHandler.bind(this, post._id)}
                />
              ))}
            </Paginator>
          )}
        </section>
      </Fragment>
    );
  }
}

export default Feed;
