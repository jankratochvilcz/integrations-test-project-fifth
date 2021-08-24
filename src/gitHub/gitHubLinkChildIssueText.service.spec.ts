import {
    GitHubIssueText,
    GitHubLinkChildIssueTextService,
} from './gitHubLinkChildIssueText.service'

describe('getExistingChildIssuesSection', () => {
    it('return undefined on empty', () => {
        const actual = new GitHubLinkChildIssueTextService().getExistingChildIssues('')
        expect(actual).toStrictEqual([])
    })
    it('returns undefined on missing table header', () => {
        const actual = new GitHubLinkChildIssueTextService().getExistingChildIssues(`
### Child Issues (Generated)
|-|-|-|-|`)
        expect(actual).toStrictEqual([])
    })
    it('returns record', () => {
        const actual = new GitHubLinkChildIssueTextService().getExistingChildIssues(`
|Child Issue|Responsible|Status|
|-|-|-|
|[Title](link)|jankratochvilcz|Opened|`)
        expect(actual).toHaveLength(1)
        expect(actual[0]).toEqual({
            title: 'Title',
            url: 'link',
            assigned: 'jankratochvilcz',
            state: 'Opened',
        })
    })
    it('returns record with nodeId', () => {
        const actual = new GitHubLinkChildIssueTextService().getExistingChildIssues(`
|Child Issue|Responsible|Status|
|-|-|-|
|<!-- myCoolNodeID666= -->[Title](link)|jankratochvilcz|Opened|`)
        expect(actual).toHaveLength(1)
        expect(actual[0]).toEqual({
            title: 'Title',
            url: 'link',
            assigned: 'jankratochvilcz',
            state: 'Opened',
            nodeId: 'myCoolNodeID666=',
        })
    })
    it('returns multiple records', () => {
        const actual = new GitHubLinkChildIssueTextService().getExistingChildIssues(`
|Child Issue|Responsible|Status|
|-|-|-|
|[Title](link)|jankratochvilcz|Opened|
|[Title2](link2)|jankratochvilcz|Opened|`)
        expect(actual).toHaveLength(2)
    })
})

describe('getExistingChildIssuesSection', () => {
    it('returns correctly formatted table', () => {
        const input: GitHubIssueText[] = [
            {
                assigned: 'zztop',
                state: 'open',
                title: 'my issue',
                url: 'myurl//',
            },
            {
                assigned: 'zztop2',
                state: 'closed',
                title: 'my issue',
                url: 'myurl//',
            },
        ]

        const actual = new GitHubLinkChildIssueTextService().getChildIssuesTable(input)

        expect(actual).toEqual(`
|Child Issue|Responsible|Status|
|-|-|-|
|[my issue](myurl//)|zztop|open|
|[my issue](myurl//)|zztop2|closed|`)
    })

    it('returns correctly formatted table with node ID', () => {
        const input: GitHubIssueText[] = [
            {
                assigned: 'zztop',
                state: 'open',
                title: 'my issue',
                url: 'myurl//',
                nodeId: 'myCOOLNodeIDjo3i=',
            },
        ]

        const actual = new GitHubLinkChildIssueTextService().getChildIssuesTable(input)

        expect(actual).toEqual(`
|Child Issue|Responsible|Status|
|-|-|-|
|<!-- myCOOLNodeIDjo3i= -->[my issue](myurl//)|zztop|open|`)
    })

    it('returns correctly formatted table with previous record', () => {
        const originalText = `My super smart issue description.

|Child Issue|Responsible|Status|
|-|-|-|
|[my issue](myurl//)|zztop|open|`

        const newTable = `|Child Issue|Responsible|Status|
|-|-|-|
|[my issue2](myurl//)|zztop|open|`

        const actual = new GitHubLinkChildIssueTextService().addOrReplaceIssuesTable(
            originalText,
            newTable,
        )

        expect(actual).toEqual(`My super smart issue description.

|Child Issue|Responsible|Status|
|-|-|-|
|[my issue2](myurl//)|zztop|open|

*This table is auto-generated it; do not put any content after it.*`)
    })

    it('doesnt destroy whitespace', () => {
        const originalText = `My super smart issue description.


Hello.

|Child Issue|Responsible|Status|
|-|-|-|
|[my issue](myurl//)|zztop|open|`

        const newTable = `|Child Issue|Responsible|Status|
|-|-|-|
|[my issue2](myurl//)|zztop|open|`

        const actual = new GitHubLinkChildIssueTextService().addOrReplaceIssuesTable(
            originalText,
            newTable,
        )

        expect(actual).toEqual(`My super smart issue description.


Hello.

|Child Issue|Responsible|Status|
|-|-|-|
|[my issue2](myurl//)|zztop|open|

*This table is auto-generated it; do not put any content after it.*`)
    })
})

describe('getTitle', () => {
    it.each([
        {
            input: 'V9 Endpoints Implementation 📜1/3',
            expected: 'V9 Endpoints Implementation',
        },
        {
            input: 'V9 Endpoints Implementation 📜111/3444',
            expected: 'V9 Endpoints Implementation',
        },
        { input: 'V9 Endpoints Implementation', expected: 'V9 Endpoints Implementation' },
        { input: 'V9 Endpoints Implementation ', expected: 'V9 Endpoints Implementation ' },
    ])('gets correct title', ({ input, expected }) => {
        const actual = new GitHubLinkChildIssueTextService().getTitle(input)
        expect(actual).toEqual(expected)
    })
})

describe('addIssueCount', () => {
    it.each([
        {
            expected: 'V9 Endpoints Implementation 📜1/3',
            completed: 1,
            total: 3,
            title: 'V9 Endpoints Implementation',
        },
        {
            expected: 'V9 Endpoints Implementation',
            completed: 0,
            total: 0,
            title: 'V9 Endpoints Implementation',
        },
    ])('gets correct title', ({ expected, completed, total, title }) => {
        const actual = new GitHubLinkChildIssueTextService().addIssueCount(title, completed, total)
        expect(actual).toEqual(expected)
    })
})
