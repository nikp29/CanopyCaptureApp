def openFile(filename):
    with open(fname) as f:
        content = f.readlines()
    # you may also want to remove whitespace characters like `\n` at the end of each line
    content = [x.strip() for x in content]
    return content
openFile()
favorite = input('What is your favorite number? ')
print 'I like the number {}, too!'.format(favorite)
