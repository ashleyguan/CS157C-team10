<h1>Tentative Git workflow:</h1>

<h3>Create a new feature branch with the master branch as the base for your change:</h3>
`git branch` This will list the branches, make sure you're on the master branch. If you're not, do `git checkout master` to switch to it.
`git checkout -b <feature branch name>`
<h3>Work on your changes. You should have one only one commit more than in the master branch. You can do this by just committing once in the end, or commititng frequently and then squashing the commits into one commit with the *rebase* command. Hrayr can show you how if you are not familiar **Please make sure your commits are descriptive so we know what we're looking at when we look through the log!**.</h3>
<h3>After your code is done and tested, go to gitub and create a pull request for your feature branch to be merged to master. At least one other person should review the code before it is merged</h3>
<h3>Accept the pull request and merge into master. Done!</h3>
