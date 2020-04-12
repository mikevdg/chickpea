import * as Primitive from "../../../xml-primitives";

// Source files:
// https://docs.oasis-open.org/odata/odata-csdl-xml/v4.01/cos01/schemas/edm.xsd


interface BaseType {
	_exists: boolean;
	_namespace: string;
}
interface _AnnotationType extends BaseType {
	$AnnotationPath?: string;
	$Binary?: string;
	$Bool?: boolean;
	$Date?: Date;
	$DateTimeOffset?: Date;
	$Decimal?: string;
	$Duration?: string;
	$EnumMember?: TEnumMemberList;
	$Float?: number;
	$Guid?: string;
	$Int?: number;
	$ModelElementPath?: string;
	$NavigationPropertyPath?: string;
	$Path?: string;
	$PropertyPath?: string;
	Qualifier?: string;
	$String?: string;
	Term: string;
	$TimeOfDay?: string;
	$UrlRef?: string;
	Add?: TTwoChildrenExpression[];
	And?: TTwoChildrenExpression[];
	Annotation?: AnnotationType[];
	AnnotationPath?: string[];
	Apply?: TApplyExpression[];
	Binary?: string[];
	Bool?: boolean[];
	Cast?: TCastOrIsOfExpression[];
	Collection?: TCollectionExpression[];
	Date?: Date[];
	DateTimeOffset?: Date[];
	Decimal?: string[];
	Div?: TTwoChildrenExpression[];
	DivBy?: TTwoChildrenExpression[];
	Duration?: string[];
	EnumMember?: TEnumMemberList[];
	Eq?: TTwoChildrenExpression[];
	Float?: number[];
	Ge?: TTwoChildrenExpression[];
	Gt?: TTwoChildrenExpression[];
	Guid?: string[];
	Has?: TTwoChildrenExpression[];
	If?: TIfExpression[];
	In?: TTwoChildrenExpression[];
	Int?: number[];
	IsOf?: TCastOrIsOfExpression[];
	LabeledElement?: TLabeledElementExpression[];
	LabeledElementReference?: string[];
	Le?: TTwoChildrenExpression[];
	Lt?: TTwoChildrenExpression[];
	Mod?: TTwoChildrenExpression[];
	ModelElementPath?: string[];
	Mul?: TTwoChildrenExpression[];
	NavigationPropertyPath?: string[];
	Ne?: TTwoChildrenExpression[];
	Neg?: TOneChildExpression[];
	Not?: TOneChildExpression[];
	Null?: TNullExpression[];
	Or?: TTwoChildrenExpression[];
	Path?: string[];
	PropertyPath?: string[];
	Record?: TRecordExpression[];
	String?: string[];
	Sub?: TTwoChildrenExpression[];
	TimeOfDay?: string[];
	UrlRef?: TOneChildExpression[];
}
interface AnnotationType extends _AnnotationType { constructor: { new(): AnnotationType }; }

export type binary = string;
type _binary = Primitive._string;

export type boolean = boolean;
type _boolean = Primitive._boolean;

export type date = Date;
type _date = Primitive._Date;

export type dateTimeStamp = Date;
type _dateTimeStamp = Primitive._Date;

export type dayTimeDuration = string;
type _dayTimeDuration = Primitive._string;

interface _SchemaType extends BaseType {
	Alias?: string;
	Namespace: string;
	Action?: TAction[];
	Annotation?: AnnotationType[];
	Annotations?: TAnnotations[];
	ComplexType?: TComplexType[];
	EntityContainer?: TEntityContainer[];
	EntityType?: TEntityType[];
	EnumType?: TEnumType[];
	Function?: TFunction[];
	Term?: TTerm[];
	TypeDefinition?: TTypeDefinition[];
}
interface SchemaType extends _SchemaType { constructor: { new(): SchemaType }; }

export type TAbstractType = ("Edm.ComplexType" | "Edm.EntityType" | "Edm.PrimitiveType" | "Edm.Untyped" | "Edm.Geography" | "Edm.Geometry" | "Edm.AnnotationPath" | "Edm.AnyPropertyPath" | "Edm.ModelElementPath" | "Edm.NavigationPropertyPath" | "Edm.PropertyPath" | "Collection(Edm.ComplexType)" | "Collection(Edm.EntityType)" | "Collection(Edm.PrimitiveType)" | "Collection(Edm.Untyped)" | "Collection(Edm.Geography)" | "Collection(Edm.Geometry)" | "Collection(Edm.AnnotationPath)" | "Collection(Edm.AnyPropertyPath)" | "Collection(Edm.ModelElementPath)" | "Collection(Edm.NavigationPropertyPath)" | "Collection(Edm.PropertyPath)");
interface _TAbstractType extends Primitive._string { content: TAbstractType; }

interface _TAction extends BaseType {
	EntitySetPath?: string;
	IsBound?: boolean;
	Name: string;
	Annotation?: AnnotationType[];
	Parameter?: TActionFunctionParameter[];
	ReturnType?: TActionFunctionReturnType[];
}
export interface TAction extends _TAction { constructor: { new(): TAction }; }
export var TAction: { new(): TAction };

interface _TActionFunctionParameter extends BaseType {
	MaxLength?: string;
	Name: string;
	Nullable?: boolean;
	Precision?: number;
	Scale?: string;
	SRID?: string;
	Type: string;
	Unicode?: boolean;
	Annotation?: AnnotationType[];
}
export interface TActionFunctionParameter extends _TActionFunctionParameter { constructor: { new(): TActionFunctionParameter }; }
export var TActionFunctionParameter: { new(): TActionFunctionParameter };

interface _TActionFunctionReturnType extends BaseType {
	MaxLength?: string;
	Nullable?: boolean;
	Precision?: number;
	Scale?: string;
	SRID?: string;
	Type: string;
	Unicode?: boolean;
	Annotation?: AnnotationType[];
}
export interface TActionFunctionReturnType extends _TActionFunctionReturnType { constructor: { new(): TActionFunctionReturnType }; }
export var TActionFunctionReturnType: { new(): TActionFunctionReturnType };

interface _TActionImport extends BaseType {
	Action: string;
	EntitySet?: string;
	Name: string;
	Annotation?: AnnotationType[];
}
export interface TActionImport extends _TActionImport { constructor: { new(): TActionImport }; }
export var TActionImport: { new(): TActionImport };

interface _TAnnotations extends BaseType {
	Qualifier?: string;
	Target: string;
	Annotation: AnnotationType[];
}
export interface TAnnotations extends _TAnnotations { constructor: { new(): TAnnotations }; }
export var TAnnotations: { new(): TAnnotations };

export type TAppliesTo = string;
type _TAppliesTo = Primitive._string;

export type TAppliesToElements = Type[];

interface _TApplyExpression extends BaseType {
	Function?: string;
	Add?: TTwoChildrenExpression[];
	And?: TTwoChildrenExpression[];
	Annotation?: AnnotationType[];
	AnnotationPath?: string[];
	Apply?: TApplyExpression[];
	Binary?: string[];
	Bool?: boolean[];
	Cast?: TCastOrIsOfExpression[];
	Collection?: TCollectionExpression[];
	Date?: Date[];
	DateTimeOffset?: Date[];
	Decimal?: string[];
	Div?: TTwoChildrenExpression[];
	DivBy?: TTwoChildrenExpression[];
	Duration?: string[];
	EnumMember?: TEnumMemberList[];
	Eq?: TTwoChildrenExpression[];
	Float?: number[];
	Ge?: TTwoChildrenExpression[];
	Gt?: TTwoChildrenExpression[];
	Guid?: string[];
	Has?: TTwoChildrenExpression[];
	If?: TIfExpression[];
	In?: TTwoChildrenExpression[];
	Int?: number[];
	IsOf?: TCastOrIsOfExpression[];
	LabeledElement?: TLabeledElementExpression[];
	LabeledElementReference?: string[];
	Le?: TTwoChildrenExpression[];
	Lt?: TTwoChildrenExpression[];
	Mod?: TTwoChildrenExpression[];
	ModelElementPath?: string[];
	Mul?: TTwoChildrenExpression[];
	NavigationPropertyPath?: string[];
	Ne?: TTwoChildrenExpression[];
	Neg?: TOneChildExpression[];
	Not?: TOneChildExpression[];
	Null?: TNullExpression[];
	Or?: TTwoChildrenExpression[];
	Path?: string[];
	PropertyPath?: string[];
	Record?: TRecordExpression[];
	String?: string[];
	Sub?: TTwoChildrenExpression[];
	TimeOfDay?: string[];
	UrlRef?: TOneChildExpression[];
}
export interface TApplyExpression extends _TApplyExpression { constructor: { new(): TApplyExpression }; }
export var TApplyExpression: { new(): TApplyExpression };

export type TBinaryConstantExpression = string;
type _TBinaryConstantExpression = _binary;

export type TBoolConstantExpression = boolean;
type _TBoolConstantExpression = _boolean;

interface _TCastOrIsOfExpression extends BaseType {
	MaxLength?: string;
	Precision?: number;
	Scale?: string;
	SRID?: string;
	Type?: string;
	Unicode?: boolean;
	Add: TTwoChildrenExpression;
	And: TTwoChildrenExpression;
	Annotation?: AnnotationType[];
	AnnotationPath: string;
	Apply: TApplyExpression;
	Binary: string;
	Bool: boolean;
	Cast: TCastOrIsOfExpression;
	Collection: TCollectionExpression;
	Date: Date;
	DateTimeOffset: Date;
	Decimal: string;
	Div: TTwoChildrenExpression;
	DivBy: TTwoChildrenExpression;
	Duration: string;
	EnumMember: TEnumMemberList;
	Eq: TTwoChildrenExpression;
	Float: number;
	Ge: TTwoChildrenExpression;
	Gt: TTwoChildrenExpression;
	Guid: string;
	Has: TTwoChildrenExpression;
	If: TIfExpression;
	In: TTwoChildrenExpression;
	Int: number;
	IsOf: TCastOrIsOfExpression;
	LabeledElement: TLabeledElementExpression;
	LabeledElementReference: string;
	Le: TTwoChildrenExpression;
	Lt: TTwoChildrenExpression;
	Mod: TTwoChildrenExpression;
	ModelElementPath: string;
	Mul: TTwoChildrenExpression;
	NavigationPropertyPath: string;
	Ne: TTwoChildrenExpression;
	Neg: TOneChildExpression;
	Not: TOneChildExpression;
	Null: TNullExpression;
	Or: TTwoChildrenExpression;
	Path: string;
	PropertyPath: string;
	Record: TRecordExpression;
	String: string;
	Sub: TTwoChildrenExpression;
	TimeOfDay: string;
	UrlRef: TOneChildExpression;
}
export interface TCastOrIsOfExpression extends _TCastOrIsOfExpression { constructor: { new(): TCastOrIsOfExpression }; }
export var TCastOrIsOfExpression: { new(): TCastOrIsOfExpression };

export type TClientFunction = string;
type _TClientFunction = Primitive._string;

interface _TCollectionExpression extends BaseType {
	Add?: TTwoChildrenExpression[];
	And?: TTwoChildrenExpression[];
	AnnotationPath?: string[];
	Apply?: TApplyExpression[];
	Binary?: string[];
	Bool?: boolean[];
	Cast?: TCastOrIsOfExpression[];
	Collection?: TCollectionExpression[];
	Date?: Date[];
	DateTimeOffset?: Date[];
	Decimal?: string[];
	Div?: TTwoChildrenExpression[];
	DivBy?: TTwoChildrenExpression[];
	Duration?: string[];
	EnumMember?: TEnumMemberList[];
	Eq?: TTwoChildrenExpression[];
	Float?: number[];
	Ge?: TTwoChildrenExpression[];
	Gt?: TTwoChildrenExpression[];
	Guid?: string[];
	Has?: TTwoChildrenExpression[];
	If?: TIfExpression[];
	In?: TTwoChildrenExpression[];
	Int?: number[];
	IsOf?: TCastOrIsOfExpression[];
	LabeledElement?: TLabeledElementExpression[];
	LabeledElementReference?: string[];
	Le?: TTwoChildrenExpression[];
	Lt?: TTwoChildrenExpression[];
	Mod?: TTwoChildrenExpression[];
	ModelElementPath?: string[];
	Mul?: TTwoChildrenExpression[];
	NavigationPropertyPath?: string[];
	Ne?: TTwoChildrenExpression[];
	Neg?: TOneChildExpression[];
	Not?: TOneChildExpression[];
	Null?: TNullExpression[];
	Or?: TTwoChildrenExpression[];
	Path?: string[];
	PropertyPath?: string[];
	Record?: TRecordExpression[];
	String?: string[];
	Sub?: TTwoChildrenExpression[];
	TimeOfDay?: string[];
	UrlRef?: TOneChildExpression[];
}
export interface TCollectionExpression extends _TCollectionExpression { constructor: { new(): TCollectionExpression }; }
export var TCollectionExpression: { new(): TCollectionExpression };

interface _TComplexType extends BaseType {
	Abstract?: boolean;
	BaseType?: string;
	Name: string;
	OpenType?: boolean;
	Annotation?: AnnotationType[];
	NavigationProperty?: TNavigationProperty[];
	Property?: TProperty[];
}
export interface TComplexType extends _TComplexType { constructor: { new(): TComplexType }; }
export var TComplexType: { new(): TComplexType };

export type TDateConstantExpression = Date;
type _TDateConstantExpression = _date;

export type TDateTimeOffsetConstantExpression = Date;
type _TDateTimeOffsetConstantExpression = _dateTimeStamp;

export type TDecimalConstantExpression = string;
type _TDecimalConstantExpression = _TDecimalLiteral;

export type TDecimalLiteral = string;
type _TDecimalLiteral = Primitive._string;

export type TDurationConstantExpression = string;
type _TDurationConstantExpression = _dayTimeDuration;

interface _TEntityContainer extends BaseType {
	Extends?: string;
	Name: string;
	ActionImport: TActionImport[];
	Annotation: AnnotationType[];
	EntitySet: TEntitySet[];
	FunctionImport: TFunctionImport[];
	Singleton: TSingleton[];
}
export interface TEntityContainer extends _TEntityContainer { constructor: { new(): TEntityContainer }; }
export var TEntityContainer: { new(): TEntityContainer };

interface _TEntityKeyElement extends BaseType {
	PropertyRef: TPropertyRef[];
}
export interface TEntityKeyElement extends _TEntityKeyElement { constructor: { new(): TEntityKeyElement }; }
export var TEntityKeyElement: { new(): TEntityKeyElement };

interface _TEntitySet extends BaseType {
	EntityType: string;
	IncludeInServiceDocument?: boolean;
	Name: string;
	Annotation?: AnnotationType[];
	NavigationPropertyBinding?: TNavigationPropertyBinding[];
}
export interface TEntitySet extends _TEntitySet { constructor: { new(): TEntitySet }; }
export var TEntitySet: { new(): TEntitySet };

interface _TEntityType extends BaseType {
	Abstract?: boolean;
	BaseType?: string;
	HasStream?: boolean;
	Name: string;
	OpenType?: boolean;
	Annotation?: AnnotationType[];
	Key?: TEntityKeyElement[];
	NavigationProperty?: TNavigationProperty[];
	Property?: TProperty[];
}
export interface TEntityType extends _TEntityType { constructor: { new(): TEntityType }; }
export var TEntityType: { new(): TEntityType };

export type TEnumMemberList = string[];

interface _TEnumType extends BaseType {
	IsFlags?: boolean;
	Name: string;
	UnderlyingType?: string;
	Annotation: AnnotationType[];
	Member: TEnumTypeMember[];
}
export interface TEnumType extends _TEnumType { constructor: { new(): TEnumType }; }
export var TEnumType: { new(): TEnumType };

interface _TEnumTypeMember extends BaseType {
	Name: string;
	Value?: number;
	Annotation?: AnnotationType[];
}
export interface TEnumTypeMember extends _TEnumTypeMember { constructor: { new(): TEnumTypeMember }; }
export var TEnumTypeMember: { new(): TEnumTypeMember };

export type TFloatConstantExpression = number;
type _TFloatConstantExpression = Primitive._number;

export type TFloating = "floating";
interface _TFloating extends Primitive._string { content: TFloating; }

interface _TFunction extends BaseType {
	EntitySetPath?: string;
	IsBound?: boolean;
	IsComposable?: boolean;
	Name: string;
	Annotation?: AnnotationType[];
	Parameter?: TActionFunctionParameter[];
	ReturnType: TActionFunctionReturnType;
}
export interface TFunction extends _TFunction { constructor: { new(): TFunction }; }
export var TFunction: { new(): TFunction };

interface _TFunctionImport extends BaseType {
	EntitySet?: string;
	Function: string;
	IncludeInServiceDocument?: boolean;
	Name: string;
	Annotation?: AnnotationType[];
}
export interface TFunctionImport extends _TFunctionImport { constructor: { new(): TFunctionImport }; }
export var TFunctionImport: { new(): TFunctionImport };

export type TGuidConstantExpression = string;
type _TGuidConstantExpression = _TGuidLiteral;

export type TGuidLiteral = string;
type _TGuidLiteral = Primitive._string;

interface _TIfExpression extends BaseType {
	Add: TTwoChildrenExpression[];
	And: TTwoChildrenExpression[];
	Annotation?: AnnotationType[];
	AnnotationPath: string[];
	Apply: TApplyExpression[];
	Binary: string[];
	Bool: boolean[];
	Cast: TCastOrIsOfExpression[];
	Collection: TCollectionExpression[];
	Date: Date[];
	DateTimeOffset: Date[];
	Decimal: string[];
	Div: TTwoChildrenExpression[];
	DivBy: TTwoChildrenExpression[];
	Duration: string[];
	EnumMember: TEnumMemberList[];
	Eq: TTwoChildrenExpression[];
	Float: number[];
	Ge: TTwoChildrenExpression[];
	Gt: TTwoChildrenExpression[];
	Guid: string[];
	Has: TTwoChildrenExpression[];
	If: TIfExpression[];
	In: TTwoChildrenExpression[];
	Int: number[];
	IsOf: TCastOrIsOfExpression[];
	LabeledElement: TLabeledElementExpression[];
	LabeledElementReference: string[];
	Le: TTwoChildrenExpression[];
	Lt: TTwoChildrenExpression[];
	Mod: TTwoChildrenExpression[];
	ModelElementPath: string[];
	Mul: TTwoChildrenExpression[];
	NavigationPropertyPath: string[];
	Ne: TTwoChildrenExpression[];
	Neg: TOneChildExpression[];
	Not: TOneChildExpression[];
	Null: TNullExpression[];
	Or: TTwoChildrenExpression[];
	Path: string[];
	PropertyPath: string[];
	Record: TRecordExpression[];
	String: string[];
	Sub: TTwoChildrenExpression[];
	TimeOfDay: string[];
	UrlRef: TOneChildExpression[];
}
export interface TIfExpression extends _TIfExpression { constructor: { new(): TIfExpression }; }
export var TIfExpression: { new(): TIfExpression };

export type time = string;
type _time = Primitive._string;

export type TInstancePath = string;
type _TInstancePath = Primitive._string;

export type TIntConstantExpression = number;
type _TIntConstantExpression = Primitive._number;

interface _TLabeledElementExpression extends BaseType {
	$AnnotationPath?: string;
	$Binary?: string;
	$Bool?: boolean;
	$Date?: Date;
	$DateTimeOffset?: Date;
	$Decimal?: string;
	$Duration?: string;
	$EnumMember?: TEnumMemberList;
	$Float?: number;
	$Guid?: string;
	$Int?: number;
	$ModelElementPath?: string;
	Name: string;
	$NavigationPropertyPath?: string;
	$Path?: string;
	$PropertyPath?: string;
	$String?: string;
	$TimeOfDay?: string;
	$UrlRef?: string;
	Add?: TTwoChildrenExpression[];
	And?: TTwoChildrenExpression[];
	Annotation?: AnnotationType[];
	AnnotationPath?: string[];
	Apply?: TApplyExpression[];
	Binary?: string[];
	Bool?: boolean[];
	Cast?: TCastOrIsOfExpression[];
	Collection?: TCollectionExpression[];
	Date?: Date[];
	DateTimeOffset?: Date[];
	Decimal?: string[];
	Div?: TTwoChildrenExpression[];
	DivBy?: TTwoChildrenExpression[];
	Duration?: string[];
	EnumMember?: TEnumMemberList[];
	Eq?: TTwoChildrenExpression[];
	Float?: number[];
	Ge?: TTwoChildrenExpression[];
	Gt?: TTwoChildrenExpression[];
	Guid?: string[];
	Has?: TTwoChildrenExpression[];
	If?: TIfExpression[];
	In?: TTwoChildrenExpression[];
	Int?: number[];
	IsOf?: TCastOrIsOfExpression[];
	LabeledElement?: TLabeledElementExpression[];
	LabeledElementReference?: string[];
	Le?: TTwoChildrenExpression[];
	Lt?: TTwoChildrenExpression[];
	Mod?: TTwoChildrenExpression[];
	ModelElementPath?: string[];
	Mul?: TTwoChildrenExpression[];
	NavigationPropertyPath?: string[];
	Ne?: TTwoChildrenExpression[];
	Neg?: TOneChildExpression[];
	Not?: TOneChildExpression[];
	Null?: TNullExpression[];
	Or?: TTwoChildrenExpression[];
	Path?: string[];
	PropertyPath?: string[];
	Record?: TRecordExpression[];
	String?: string[];
	Sub?: TTwoChildrenExpression[];
	TimeOfDay?: string[];
	UrlRef?: TOneChildExpression[];
}
export interface TLabeledElementExpression extends _TLabeledElementExpression { constructor: { new(): TLabeledElementExpression }; }
export var TLabeledElementExpression: { new(): TLabeledElementExpression };

export type TLabeledElementReferenceExpression = string;
type _TLabeledElementReferenceExpression = _TQualifiedName;

export type TMax = "max";
interface _TMax extends Primitive._string { content: TMax; }

export type TMaxLengthFacet = string;
type _TMaxLengthFacet = Primitive._string;

export type TModelPath = string;
type _TModelPath = Primitive._string;

export type TNamespaceName = string;
type _TNamespaceName = Primitive._string;

interface _TNavigationProperty extends BaseType {
	ContainsTarget?: boolean;
	Name: string;
	Nullable?: boolean;
	Partner?: string;
	Type: string;
	Annotation?: AnnotationType[];
	OnDelete?: TOnDelete[];
	ReferentialConstraint?: TReferentialConstraint[];
}
export interface TNavigationProperty extends _TNavigationProperty { constructor: { new(): TNavigationProperty }; }
export var TNavigationProperty: { new(): TNavigationProperty };

interface _TNavigationPropertyBinding extends BaseType {
	Path: string;
	Target: string;
}
export interface TNavigationPropertyBinding extends _TNavigationPropertyBinding { constructor: { new(): TNavigationPropertyBinding }; }
export var TNavigationPropertyBinding: { new(): TNavigationPropertyBinding };

interface _TNullExpression extends BaseType {
	Annotation?: AnnotationType[];
}
export interface TNullExpression extends _TNullExpression { constructor: { new(): TNullExpression }; }
export var TNullExpression: { new(): TNullExpression };

interface _TOnDelete extends BaseType {
	Action: TOnDeleteAction;
	Annotation?: AnnotationType[];
}
export interface TOnDelete extends _TOnDelete { constructor: { new(): TOnDelete }; }
export var TOnDelete: { new(): TOnDelete };

export type TOnDeleteAction = ("Cascade" | "None" | "SetDefault" | "SetNull");
interface _TOnDeleteAction extends Primitive._string { content: TOnDeleteAction; }

interface _TOneChildExpression extends BaseType {
	Add: TTwoChildrenExpression;
	And: TTwoChildrenExpression;
	Annotation?: AnnotationType[];
	AnnotationPath: string;
	Apply: TApplyExpression;
	Binary: string;
	Bool: boolean;
	Cast: TCastOrIsOfExpression;
	Collection: TCollectionExpression;
	Date: Date;
	DateTimeOffset: Date;
	Decimal: string;
	Div: TTwoChildrenExpression;
	DivBy: TTwoChildrenExpression;
	Duration: string;
	EnumMember: TEnumMemberList;
	Eq: TTwoChildrenExpression;
	Float: number;
	Ge: TTwoChildrenExpression;
	Gt: TTwoChildrenExpression;
	Guid: string;
	Has: TTwoChildrenExpression;
	If: TIfExpression;
	In: TTwoChildrenExpression;
	Int: number;
	IsOf: TCastOrIsOfExpression;
	LabeledElement: TLabeledElementExpression;
	LabeledElementReference: string;
	Le: TTwoChildrenExpression;
	Lt: TTwoChildrenExpression;
	Mod: TTwoChildrenExpression;
	ModelElementPath: string;
	Mul: TTwoChildrenExpression;
	NavigationPropertyPath: string;
	Ne: TTwoChildrenExpression;
	Neg: TOneChildExpression;
	Not: TOneChildExpression;
	Null: TNullExpression;
	Or: TTwoChildrenExpression;
	Path: string;
	PropertyPath: string;
	Record: TRecordExpression;
	String: string;
	Sub: TTwoChildrenExpression;
	TimeOfDay: string;
	UrlRef: TOneChildExpression;
}
export interface TOneChildExpression extends _TOneChildExpression { constructor: { new(): TOneChildExpression }; }
export var TOneChildExpression: { new(): TOneChildExpression };

export type TPath = string;
type _TPath = Primitive._string;

export type TPrecisionFacet = number;
type _TPrecisionFacet = Primitive._number;

export type TPrimitiveType = string;
type _TPrimitiveType = Primitive._string;

interface _TProperty extends BaseType {
	DefaultValue?: string;
	MaxLength?: string;
	Name: string;
	Nullable?: boolean;
	Precision?: number;
	Scale?: string;
	SRID?: string;
	Type: string;
	Unicode?: boolean;
	Annotation?: AnnotationType[];
}
export interface TProperty extends _TProperty { constructor: { new(): TProperty }; }
export var TProperty: { new(): TProperty };

interface _TPropertyRef extends BaseType {
	Alias?: string;
	Name: string;
}
export interface TPropertyRef extends _TPropertyRef { constructor: { new(): TPropertyRef }; }
export var TPropertyRef: { new(): TPropertyRef };

interface _TPropertyValue extends BaseType {
	$AnnotationPath?: string;
	$Binary?: string;
	$Bool?: boolean;
	$Date?: Date;
	$DateTimeOffset?: Date;
	$Decimal?: string;
	$Duration?: string;
	$EnumMember?: TEnumMemberList;
	$Float?: number;
	$Guid?: string;
	$Int?: number;
	$ModelElementPath?: string;
	$NavigationPropertyPath?: string;
	$Path?: string;
	Property: string;
	$PropertyPath?: string;
	$String?: string;
	$TimeOfDay?: string;
	$UrlRef?: string;
	Add?: TTwoChildrenExpression[];
	And?: TTwoChildrenExpression[];
	Annotation?: AnnotationType[];
	AnnotationPath?: string[];
	Apply?: TApplyExpression[];
	Binary?: string[];
	Bool?: boolean[];
	Cast?: TCastOrIsOfExpression[];
	Collection?: TCollectionExpression[];
	Date?: Date[];
	DateTimeOffset?: Date[];
	Decimal?: string[];
	Div?: TTwoChildrenExpression[];
	DivBy?: TTwoChildrenExpression[];
	Duration?: string[];
	EnumMember?: TEnumMemberList[];
	Eq?: TTwoChildrenExpression[];
	Float?: number[];
	Ge?: TTwoChildrenExpression[];
	Gt?: TTwoChildrenExpression[];
	Guid?: string[];
	Has?: TTwoChildrenExpression[];
	If?: TIfExpression[];
	In?: TTwoChildrenExpression[];
	Int?: number[];
	IsOf?: TCastOrIsOfExpression[];
	LabeledElement?: TLabeledElementExpression[];
	LabeledElementReference?: string[];
	Le?: TTwoChildrenExpression[];
	Lt?: TTwoChildrenExpression[];
	Mod?: TTwoChildrenExpression[];
	ModelElementPath?: string[];
	Mul?: TTwoChildrenExpression[];
	NavigationPropertyPath?: string[];
	Ne?: TTwoChildrenExpression[];
	Neg?: TOneChildExpression[];
	Not?: TOneChildExpression[];
	Null?: TNullExpression[];
	Or?: TTwoChildrenExpression[];
	Path?: string[];
	PropertyPath?: string[];
	Record?: TRecordExpression[];
	String?: string[];
	Sub?: TTwoChildrenExpression[];
	TimeOfDay?: string[];
	UrlRef?: TOneChildExpression[];
}
export interface TPropertyValue extends _TPropertyValue { constructor: { new(): TPropertyValue }; }
export var TPropertyValue: { new(): TPropertyValue };

export type TQualifiedName = string;
type _TQualifiedName = Primitive._string;

interface _TRecordExpression extends BaseType {
	Type?: string;
	Annotation?: AnnotationType[];
	PropertyValue?: TPropertyValue[];
}
export interface TRecordExpression extends _TRecordExpression { constructor: { new(): TRecordExpression }; }
export var TRecordExpression: { new(): TRecordExpression };

interface _TReferentialConstraint extends BaseType {
	Property: string;
	ReferencedProperty: string;
	Annotation?: AnnotationType[];
}
export interface TReferentialConstraint extends _TReferentialConstraint { constructor: { new(): TReferentialConstraint }; }
export var TReferentialConstraint: { new(): TReferentialConstraint };

export type TScaleFacet = string;
type _TScaleFacet = Primitive._string;

export type TSimpleIdentifier = string;
type _TSimpleIdentifier = Primitive._string;

interface _TSingleton extends BaseType {
	Name: string;
	Nullable?: boolean;
	Type: string;
	Annotation?: AnnotationType[];
	NavigationPropertyBinding?: TNavigationPropertyBinding[];
}
export interface TSingleton extends _TSingleton { constructor: { new(): TSingleton }; }
export var TSingleton: { new(): TSingleton };

export type TSridFacet = string;
type _TSridFacet = Primitive._string;

export type TStringConstantExpression = string;
type _TStringConstantExpression = Primitive._string;

export type TTarget = string;
type _TTarget = Primitive._string;

interface _TTerm extends BaseType {
	AppliesTo?: string;
	BaseTerm?: string;
	DefaultValue?: string;
	MaxLength?: string;
	Name: string;
	Nullable?: boolean;
	Precision?: number;
	Scale?: string;
	SRID?: string;
	Type: string;
	Unicode?: boolean;
	Annotation?: AnnotationType[];
}
export interface TTerm extends _TTerm { constructor: { new(): TTerm }; }
export var TTerm: { new(): TTerm };

export type TTimeOfDayConstantExpression = string;
type _TTimeOfDayConstantExpression = _time;

interface _TTwoChildrenExpression extends BaseType {
	Add: TTwoChildrenExpression[];
	And: TTwoChildrenExpression[];
	Annotation?: AnnotationType[];
	AnnotationPath: string[];
	Apply: TApplyExpression[];
	Binary: string[];
	Bool: boolean[];
	Cast: TCastOrIsOfExpression[];
	Collection: TCollectionExpression[];
	Date: Date[];
	DateTimeOffset: Date[];
	Decimal: string[];
	Div: TTwoChildrenExpression[];
	DivBy: TTwoChildrenExpression[];
	Duration: string[];
	EnumMember: TEnumMemberList[];
	Eq: TTwoChildrenExpression[];
	Float: number[];
	Ge: TTwoChildrenExpression[];
	Gt: TTwoChildrenExpression[];
	Guid: string[];
	Has: TTwoChildrenExpression[];
	If: TIfExpression[];
	In: TTwoChildrenExpression[];
	Int: number[];
	IsOf: TCastOrIsOfExpression[];
	LabeledElement: TLabeledElementExpression[];
	LabeledElementReference: string[];
	Le: TTwoChildrenExpression[];
	Lt: TTwoChildrenExpression[];
	Mod: TTwoChildrenExpression[];
	ModelElementPath: string[];
	Mul: TTwoChildrenExpression[];
	NavigationPropertyPath: string[];
	Ne: TTwoChildrenExpression[];
	Neg: TOneChildExpression[];
	Not: TOneChildExpression[];
	Null: TNullExpression[];
	Or: TTwoChildrenExpression[];
	Path: string[];
	PropertyPath: string[];
	Record: TRecordExpression[];
	String: string[];
	Sub: TTwoChildrenExpression[];
	TimeOfDay: string[];
	UrlRef: TOneChildExpression[];
}
export interface TTwoChildrenExpression extends _TTwoChildrenExpression { constructor: { new(): TTwoChildrenExpression }; }
export var TTwoChildrenExpression: { new(): TTwoChildrenExpression };

interface _TTypeDefinition extends BaseType {
	MaxLength?: string;
	Name: string;
	Precision?: number;
	Scale?: string;
	SRID?: string;
	UnderlyingType: string;
	Unicode?: boolean;
	Annotation?: AnnotationType[];
}
export interface TTypeDefinition extends _TTypeDefinition { constructor: { new(): TTypeDefinition }; }
export var TTypeDefinition: { new(): TTypeDefinition };

export type TTypeName = string;
type _TTypeName = Primitive._string;

export type TUnicodeFacet = boolean;
type _TUnicodeFacet = Primitive._boolean;

export type TVariable = "variable";
interface _TVariable extends Primitive._string { content: TVariable; }

type Type = ("Action" | "ActionImport" | "Annotation" | "Apply" | "Cast" | "Collection" | "ComplexType" | "EntityContainer" | "EntitySet" | "EntityType" | "EnumType" | "Function" | "FunctionImport" | "If" | "Include" | "IsOf" | "LabeledElement" | "Member" | "NavigationProperty" | "Null" | "OnDelete" | "Parameter" | "Property" | "PropertyValue" | "Record" | "Reference" | "ReferentialConstraint" | "ReturnType" | "Schema" | "Singleton" | "Term" | "TypeDefinition" | "UrlRef");
interface _Type extends Primitive._string { content: Type; }

export interface document extends BaseType {
	Annotation: AnnotationType;
	Annotations: TAnnotations;
	Schema: SchemaType;
}
export var document: document;
