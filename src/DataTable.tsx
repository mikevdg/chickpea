import React from 'react';
import * as query from './query';
import './App.css';
import './DataTable.css';

// TODO If the size of the contents div changes:
//  https://www.pluralsight.com/guides/re-render-react-component-on-window-resize


export interface DataTableProps {
    table: query.Query;
    refetch: any; // function. TODO: what is its type?
    children: never[];
}

export interface DataTableState {
    scrollY: number;
}

/** I do not have any state. */
export class DataTable extends React.Component<DataTableProps, DataTableState> {
    private columnWidths: Array<number>;
    private contentDivRef : React.RefObject<HTMLDivElement>;
    private height : number = 100;
    private pixelsPerRow : number = 30;
    private numVisibleRows : number = 100;

    constructor(props: Readonly<DataTableProps>) {
        super(props);
        this.columnWidths = [];
        this.state = {
            scrollY: 0
        };
        this.contentDivRef = React.createRef();

        this.onOrderBy = this.onOrderBy.bind(this);
        this.onExpandComplexColumn = this.onExpandComplexColumn.bind(this);
        this.onUnexpandComplexColumn = this.onUnexpandComplexColumn.bind(this);
        this.renderHeadingToHtml = this.renderHeadingToHtml.bind(this);
        this.renderHeadingsToHtmlAtDepth = this.renderHeadingsToHtmlAtDepth.bind(this);
        this.renderHeadings = this.renderHeadings.bind(this);
        this.renderTableContent = this.renderTableContent.bind(this);
    }

    public static defaultProps = {
        table: (query.Query.create("", "")), // TODO: "Loading..."
        refetch: (() => { })
    }

    render = () => {
        console.log("render");

        this.columnWidths = (
            range(this.props.table.numColumns())
                .map((a) => 100));

        let firstVisibleRow = Math.max(0, this.firstVisibleRow()-10);
        let aboveHeight = firstVisibleRow * this.pixelsPerRow;
        let numRows = 512; // this.props.table.count();
        let belowHeight = (numRows - firstVisibleRow - this.numVisibleRows) * this.pixelsPerRow;

        console.log(`aboveHeight ${aboveHeight} belowHeight ${belowHeight} scrollY ${this.state.scrollY} firstVisibleRow ${firstVisibleRow}`);
        console.log(`height: ${this.height} total height: ${aboveHeight+belowHeight} numVisible: ${this.numVisibleRows}`);

        return (
            <div className="datatable">
                <input value={this.state.scrollY} />
                <div className="datatable-filterdiv">
                    Filter
                </div>
                <div
                    className="datatable-headerdiv"
                    style={this.gridStyle()}>
                    {this.renderHeadings()}
                </div>
                <div
                    className="datatable-contentsdiv"
                    style={this.gridStyle()}
                    onScroll={(e) => this.handleScroll(e)}
                    ref={this.contentDivRef}>
                    {this.aboveHeight(aboveHeight)}
                    {this.renderTableContent()}
                    {this.belowHeight(belowHeight)}
                </div>
            </div>
        );
    }

    componentDidMount = () => {
        console.log("componentDidMount");
        if (null !== this.contentDivRef.current) {
            this.height = this.contentDivRef.current.clientHeight;
            // Plus 2 - one to counteract Math.floor, one to cover the gap at the bottom.
            this.numVisibleRows = Math.floor(this.height / this.pixelsPerRow)+20;
        }
    }

    aboveHeight = (height : number ) => {
        const layout = {
            height: height,
            gridRowStart: 1,
            gridRowEnd: 1,
            gridColumnStart: 1,
            gridColumnEnd: 1
        }
        return <div style={layout}></div>;
    }

    belowHeight = (height: number) => {
        const last = this.numVisibleRows;
        const layout = {
            height: height,
            gridRowStart: last+2,
            gridRowEnd: last+2,
            gridColumnStart: 1,
            gridColumnEnd: 1
        }
        return <div style={layout}></div>;
    }

    gridStyle = () => {
        let c =
            this.columnWidths
                .map((each) => `${each}px `)
                .reduce((a, v) => a.concat(v), "");

        return {
            display: 'grid',
            gridTemplateColumns: c,
            backgroundColor: "blue"
        };
    }

    renderHeadings(): JSX.Element {
        let columns: query.ComplexColumnDefinition = this.props.table._select;
        let mmaxDepth: number = columns.depth();

        if (columns.isEmpty()) {
            return <React.Fragment />
        } else {
            return <React.Fragment> {
                range(mmaxDepth).map(ddepth =>
                (<React.Fragment>
                    {this.renderHeadingsToHtmlAtDepth(columns, ddepth,
                        mmaxDepth)}
                </React.Fragment>
                ))
            } </React.Fragment>
        }
    }

    renderHeadingsToHtmlAtDepth(
        columns: query.ComplexColumnDefinition,
        ddepth: number,
        mmaxDepth: number)
        : JSX.Element {

        return (<React.Fragment>
            {columns.map(
                (each, i) => 
                    this.renderHeadingToHtml(
                        each, i, ddepth, mmaxDepth)
                )
            }
        </React.Fragment>);
    }

    renderHeadingToHtml(
        column: query.ColumnDefinition,
        index: number,
        ddepth: number,
        mmaxDepth: number)
        : JSX.Element {
        let t = this.props.table;

        let renderMe: Array<query.ColumnDefinition> =
            columnAtDepth(column, ddepth);

        let collapse: JSX.Element;
        if (column.isComplex()) {
            if (this.props.table.isExpanded(column)) {
                collapse = miniButton("⏷",
                    (e) => this.onExpandComplexColumn(e, t, column));
            } else {
                collapse = miniButton("⏵", (e) => this.onUnexpandComplexColumn(e, t, column));
            }
        }

        let orderBy: JSX.Element;
        switch (query.orderedBy(t, column)) {
            case query.OrderedBy.ASC:
                orderBy = miniButton("◢", (e) =>
                    this.onOrderBy(e, t, column, query.OrderedBy.DESC));
                break;
            case query.OrderedBy.DESC:
                orderBy = miniButton("◥", (e) =>
                    this.onOrderBy(e, t, column, query.OrderedBy.NA));
                break;
            default:
                orderBy = miniButton("⊿", (e) =>
                    this.onOrderBy(e, t, column, query.OrderedBy.ASC));
                break;
        }

        const layout = {
            gridRowStart: ddepth,
            gridRowEnd: ddepth,
            gridColumnStart: index + 1,
            gridColumnEnd: index + 1
        }

        return (<React.Fragment>
            {renderMe.map(each => {
                return <div
                    className="datatable-head-cell"
                    style={layout}
                    /*rowSpan={mmaxDepth - column.depth()}*/>
                    {collapse}
                    {each.name}
                    {orderBy}
                </div>
            }
            )}
        </React.Fragment>);
    }

    firstVisibleRow = () => {
        return Math.floor(this.state.scrollY / this.pixelsPerRow);
    }

    renderTableContent(): JSX.Element[] {
        let rows = this.props.table.contents;
        rows = rows.concat(rows);
        rows = rows.concat(rows);
        rows = rows.concat(rows);
        rows = rows.concat(rows);
        rows = rows.concat(rows);
        rows = rows.concat(rows);
        console.log(`num rows: ${rows.length}`);

        let firstVisibleRow = this.firstVisibleRow();
        let visibleRows = rows.slice(
            firstVisibleRow,
            firstVisibleRow+this.numVisibleRows);

        return (
            visibleRows.map((eachRow, row) =>
                <React.Fragment>
                    {eachRow.cells.map((eachCell, column) => {
                        const layout : React.CSSProperties = {
                            overflowX: "hidden",
                            height: this.pixelsPerRow,
                            gridRowStart: row + 2,
                            gridRowEnd: row + 2,
                            gridColumnStart: column+1,
                            gridColumnEnd: column+1,
                            backgroundColor: "red"                           
                        }
                        return <div key={`R${row}C${column}`}
                            style={layout}>
                            {String(eachCell)}
                        </div>
                    }
                    )}
                </React.Fragment>
            ));
    }

    onOrderBy(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        t: query.Query,
        column: query.ColumnDefinition,
        orderBy: query.OrderedBy
    )
        : void {
        let t2 = t.copy();
        t2.orderBy(column, orderBy);
        this.props.refetch(t2);
    }

    onExpandComplexColumn(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        t: query.Query,
        column: query.ColumnDefinition
    )
        : void {
        this.props.refetch(t.copy().expand(column));
    }

    onUnexpandComplexColumn(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        t: query.Query,
        column: query.ColumnDefinition
    )
        : void {
        console.log("Unexpand " + column.name);
    }

    handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        // TODO: A much better way of doing this is to have hidden divs above
        // and below the content, and resize them.
        // https://codesandbox.io/s/react-virtual-scrolling-basics-u1svg
        console.log("handleScroll");
        this.setState({ scrollY: (event.target as any).scrollTop });
    }
}

function columnAtDepth(
    column: query.ColumnDefinition,
    ddepth: number)
    : Array<query.ColumnDefinition> {
    if (1 === ddepth) {
        return [column];
    } else {
        if (column.isComplex()) {
            let children: Array<query.ColumnDefinition> =
                column.childs();
            return flatten(
                children.map(columnAtDepth)
            );
        } else {
            return []; // We are below the depth of a primitive column.
        }
    }
}

function range(to: number) {
    let result = Array.from(Array(to + 1).keys());
    result.shift(); // Remove the zero.
    return result;
}

function flatten(list: Array<any>) {
    return [].concat.apply([], list);
}

function miniButton(
    contents: string,
    action: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)) {
    return (<button onClick={action} className="datatable-minibutton">{contents}</button>);
}

