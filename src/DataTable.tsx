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
    firstVisibleRow: number; // Index of the row at the top of the visible table.
    
}

// What percentage of rows to buffer off-screen. 0.5 = 50% of visible rows.
const offscreenRowBufferSizePercent : number = 0.5;
// What percentage of rows can we scroll before we render()?
const offscreenRowScrollTolerancePercent : number = 0.2;

export class DataTable extends React.Component<DataTableProps, DataTableState> {
    // What percentage (actually 0 to 1) of rows to render off-screen as a buffer.

    private columnWidths: Array<number>;
    private contentDivRef : React.RefObject<HTMLDivElement>;

    private height : number = 100; // Height in pixels of the visible table contents.

    // Managing virtual scrolling:
    private pixelsPerRow : number = 30; 
    private numVisibleRows : number = 100; // Should be height/pixelsPerRow
    private firstRenderedRow: number=0; // Off-screen, the first row we render.
    private lastRenderedRow: number=0; // Off-screen, the last row we render.
    private numRows: number = 1;

    constructor(props: Readonly<DataTableProps>) {
        super(props);
        this.columnWidths = [];
        this.state = {
            firstVisibleRow: 0
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
        table: (new query.CollectionQuery([], [])),
        refetch: (() => { })
    }

    render = () => {
        this.columnWidths = (
            range(this.props.table.numColumns())
                .map((a) => 100));

        this.numRows = 512; // this.props.table.count();

        this.firstRenderedRow = Math.max(0, this.state.firstVisibleRow - this.numberOfRowsToBuffer());
        this.lastRenderedRow = Math.min(
            this.numRows,
            this.state.firstVisibleRow + this.numVisibleRows + this.numberOfRowsToBuffer());
        
        let aboveHeight = this.firstRenderedRow * this.pixelsPerRow;

        let belowHeight = (this.numRows - this.lastRenderedRow) * this.pixelsPerRow;

        return (
            <div className="datatable">
                <input readOnly={true} value={this.state.firstVisibleRow} />
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
                    {this.fillerDivAbove(aboveHeight)}
                    {this.renderTableContent()}
                    {this.fillerDivBelow(belowHeight)}
                </div>
            </div>
        );
    }

    private gridStyle = () => {
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

    private renderHeadings(): JSX.Element {
        let columns: query.ComplexColumnDefinition = this.props.table.select;
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

    private renderHeadingsToHtmlAtDepth(
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

    private renderHeadingToHtml(
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

    private renderTableContent(): JSX.Element[] {
        let rows = this.props.table.get(this.firstRenderedRow, this.lastRenderedRow);
        return (
            rows.map((eachRow, row) =>
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

    private numberOfRowsToBuffer = () => {
        return Math.floor(this.numVisibleRows * offscreenRowBufferSizePercent);
    }

    private onOrderBy(
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

    private onExpandComplexColumn(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        t: query.Query,
        column: query.ColumnDefinition
    )
        : void {
        this.props.refetch(t.copy().expand(column));
    }

    private onUnexpandComplexColumn(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        t: query.Query,
        column: query.ColumnDefinition
    )
        : void {
        console.log("Unexpand " + column.name);
    }

    /* Infinite scrolling functionality.
       -----------------------------------

    This is implemented by having:

    <div overflow=scroll onscroll=... >
      <div height=HUGE/>  - rendered by aboveHeight().
      <only the visible rows/>
      <div height=HUGE/> - rendered by belowHeight().
    </div>

    The scroll handler on the outer div resizes the filler divs.

    Now - there are issues. If you resize contents while scrolling, you get another scroll event which can cause an infinite loop. To prevent this, we have an amount of leeway so that quite a bit of scrolling can happen before we need to resize anything, and then we hope the user doesn't notice the extra scroll event.

    */

    handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        let scrollY = (event.target as any).scrollTop;
        let currentTopVisibleRow = Math.floor(scrollY / this.pixelsPerRow);
        if (this.userHasScrolledTooFar(currentTopVisibleRow)) {
            this.setState({ firstVisibleRow: currentTopVisibleRow });
        }
    }

    /* Return true if the user scrolls too far. */
    private userHasScrolledTooFar : (currentTopVisibleRow: number) => boolean 
        = (currentTopVisibleRow) => {
            // I'm measuring tolerance from the edges.
            let tolerance = (offscreenRowBufferSizePercent - offscreenRowScrollTolerancePercent) * this.numVisibleRows;
            let toleranceTop = (this.firstRenderedRow<tolerance) ? 0 : this.firstRenderedRow + tolerance;
            // TODO: I think there's an off-by-one error here:
            let toleranceBottom = (this.numRows-this.lastRenderedRow<tolerance) ? this.numRows : this.lastRenderedRow - tolerance;

            return currentTopVisibleRow < toleranceTop
                || currentTopVisibleRow+this.numVisibleRows > toleranceBottom;
    }

    componentDidMount : () => void = () => {
        console.log("componentDidMount");
        if (null !== this.contentDivRef.current) {
            this.height = this.contentDivRef.current.clientHeight;
            // Plus 2 - one to counteract Math.floor, one to cover the gap at the bottom.
            this.numVisibleRows = Math.floor(this.height / this.pixelsPerRow)+20;
        }
    }

    /** Render a "filler" div above the visible table contents to make 
     * virtual scrolling happen. */
    private fillerDivAbove : (height: number) => JSX.Element 
        = (height : number ) => {
        const layout = {
            height: height,
            gridRowStart: 1,
            gridRowEnd: 1,
            gridColumnStart: 1,
            gridColumnEnd: 1
        }
        return <div style={layout}></div>;
    }

    /** Render a "filler" div below the visible table contents to make 
     * virtual scrolling happen. */
     private fillerDivBelow : (height: number) => JSX.Element 
        = (height: number) => {
        const last = this.lastRenderedRow;
        const layout = {
            height: height,
            gridRowStart: last+2,
            gridRowEnd: last+2,
            gridColumnStart: 1,
            gridColumnEnd: 1
        }
        return <div style={layout}></div>;
    }
}


/** Used to render hierarchical headings. */
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

export function range(to: number) {
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

