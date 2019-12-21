import { config, mount, Wrapper } from '@vue/test-utils';

import { User } from 'ag-client-typescript';

import Roster from '@/components/course_admin/roster/roster.vue';
import ValidatedForm from '@/components/validated_form.vue';
import ValidatedInput from '@/components/validated_input.vue';

import { set_validated_input_text } from '@/tests/utils';

beforeAll(() => {
    config.logModifiedComponents = false;
});

describe('Roster tests', () => {
    let wrapper: Wrapper<Roster>;
    let roster: Roster;
    let user_1: User;
    let user_2: User;
    let user_3: User;
    let user_4: User;
    let new_user_1: User;
    let new_user_2: User;
    let validated_input: Wrapper<ValidatedInput>;
    let validated_input_component: ValidatedInput;
    let roster_form_component: ValidatedForm;
    let roster_form_wrapper: Wrapper<ValidatedForm>;

    beforeEach(() => {
        user_1 = new User({
            pk: 1,
            username: "coolmom@umich.edu",
            first_name: "Amy",
            last_name: "Poehler",
            email: "coolmom@umich.edu",
            is_superuser: true
        });
        user_2 = new User({
            pk: 2,
            username: "amandaplease@umich.edu",
            first_name: "Amanda",
            last_name: "Bynes",
            email: "amandaplease@umich.edu",
            is_superuser: true
        });
        user_3 = new User({
            pk: 3,
            username: "worldsbestboss@umich.edu",
            first_name: "Steve",
            last_name: "Carell",
            email: "worldsbestbo$$@umich.edu",
            is_superuser: true
        });
        user_4 = new User({
            pk: 3,
            username: "freshPrince@umich.edu",
            first_name: "Will",
            last_name: "Smith",
            email: "freshPrince@umich.edu",
            is_superuser: true
        });
        new_user_1 = new User({
            pk: 4,
            username: "letitsnow@umich.edu",
            first_name: "Brittany",
            last_name: "Snow",
            email: "letitsnow@umich.edu",
            is_superuser: true
        });
        new_user_2 = new User({
            pk: 5,
            username: "sevenEleven@umich.edu",
            first_name: "Millie",
            last_name: "Brown",
            email: "sevenEleven@umich.edu",
            is_superuser: true
        });

        wrapper = mount(Roster, {
            propsData: {
                role: "admin",
                roster: [user_1, user_2, user_3, user_4]
            }
        });

        roster = wrapper.vm;
        expect(roster.d_roster.length).toEqual(4);

        validated_input = <Wrapper<ValidatedInput>> wrapper.find('#add-users-input');
        validated_input_component = <ValidatedInput> wrapper.find('#add-users-input').vm;
        roster_form_component = <ValidatedForm> wrapper.find('#add-users-form').vm;
        roster_form_wrapper = <Wrapper<ValidatedForm>> wrapper.find('#add-users-form');
        // validated_input.find('#textarea').trigger('input');
    });

    afterEach(() => {
        if (wrapper.exists()) {
            wrapper.destroy();
        }
    });

    test('Usernames are displayed in alphabetical order', () => {
        expect(roster.role).toEqual("admin");
        expect(roster.d_roster[0]).toEqual(user_2); // amandaplease
        expect(roster.d_roster[1]).toEqual(user_1); // coolmom
        expect(roster.d_roster[2]).toEqual(user_4); // freshPrince
        expect(roster.d_roster[3]).toEqual(user_3); // worldsbestboss

        let all_users = wrapper.findAll('.email');

        expect(all_users.at(0).text()).toEqual(user_2.username);
        expect(all_users.at(1).text()).toEqual(user_1.username);
        expect(all_users.at(2).text()).toEqual(user_4.username);
        expect(all_users.at(3).text()).toEqual(user_3.username);
    });

    test('When a user is removed from roster, the parent component is notified', async () => {
        let remove_user_buttons = wrapper.findAll('.remove-user');
        remove_user_buttons.at(1).trigger('click');
        await roster.$nextTick();

        expect(roster.d_roster.length).toEqual(4);

        expect(wrapper.emitted().remove_user.length).toBe(1);
        expect(wrapper.emitted().remove_user[0][0]).toEqual([user_1]);
    });

    test('The d_roster is updated when the value of the roster prop changes in the parent',
         async () => {
        let all_users = wrapper.findAll('.email');
        expect(all_users.at(0).text()).toEqual(user_2.username);
        expect(all_users.at(1).text()).toEqual(user_1.username);
        expect(all_users.at(2).text()).toEqual(user_4.username);
        expect(all_users.at(3).text()).toEqual(user_3.username);
        expect(roster.d_roster.length).toEqual(4);

        wrapper.setProps({roster: [user_1, user_3, user_4, new_user_1, new_user_2, user_2]});
        await roster.$nextTick();
        expect(roster.d_roster.length).toEqual(6);

        all_users = wrapper.findAll('.email');
        expect(all_users.at(0).text()).toEqual(user_2.username);
        expect(all_users.at(1).text()).toEqual(user_1.username);
        expect(all_users.at(2).text()).toEqual(user_4.username);
        expect(all_users.at(3).text()).toEqual(new_user_1.username);
        expect(all_users.at(4).text()).toEqual(new_user_2.username);
        expect(all_users.at(5).text()).toEqual(user_3.username);
    });

    test('Usernames that adhere to the valid email regex are valid', async () => {
        set_validated_input_text(
            validated_input, "ch%cken.n00dle.s0up+soda-on_the-side@2007-WebstarAndYoungB.edu");
        expect(roster_form_component.is_valid).toBe(true);
        expect(validated_input_component.d_input_value).toBe(
        'ch%cken.n00dle.s0up+soda-on_the-side@2007-WebstarAndYoungB.edu'
        );

        set_validated_input_text(validated_input, "sk8gr8m8@umich.edu");
        expect(roster_form_component.is_valid).toBe(true);
        expect(validated_input_component.d_input_value).toBe('sk8gr8m8@umich.edu');

        set_validated_input_text(validated_input, "a_B-C@d-e-f-g.hi");
        expect(roster_form_component.is_valid).toBe(true);
        expect(validated_input_component.d_input_value).toBe('a_B-C@d-e-f-g.hi');
    });

    test('Emails whose local-part (before the @ symbol) is empty are invalid',
         async () => {
        set_validated_input_text(validated_input, "@e.iou");
        expect(roster_form_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('@e.iou');
    });

    test("Empty string cannot be added to a roster", async () => {
        set_validated_input_text(validated_input, "         ");
        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe("         ");

        roster_form_wrapper.trigger('submit');
        await roster.$nextTick();

        expect(wrapper.emitted('add_users')).not.toBeTruthy();
    });

    // /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    test('emails that contain disallowed characters in the local-part are invalid',
         async () => {
        set_validated_input_text(validated_input, "a*@e.iou");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('a*@e.iou');
        // console.log("Users to add: " + roster.users_to_add);
        // Something about these tests makes it so that the following two assertions
        // fail (only when the input is changed more than once in a test).
        // This behavior has been independently tested as part of the validated form
        // tests.
        // UPDATE: The refactoring of validated form and input included in fixing #127
        // appears to have fixed this issue.
        expect(roster_form_component.is_valid).toBe(false);
        expect(roster.add_users_form_is_valid).toBe(false);

        set_validated_input_text(validated_input, "a?@e.iou");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('a?@e.iou');
        // See above comment
        expect(roster_form_component.is_valid).toBe(false);
        expect(roster.add_users_form_is_valid).toBe(false);

        set_validated_input_text(validated_input, "a(@e.iou");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('a(@e.iou');
        // See above comment
        expect(roster_form_component.is_valid).toBe(false);
        expect(roster.add_users_form_is_valid).toBe(false);
    });

    test('Emails missing the @ character after the local part are invalid',
         async () => {
        set_validated_input_text(validated_input, "iceberg.iou");
        await roster.$nextTick();

        expect(roster_form_component.is_valid).toBe(false);
        expect(roster.add_users_form_is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('iceberg.iou');
    });

    test('Emails containing invalid characters in the mail server portion are invalid',
         async () => {

        set_validated_input_text(validated_input, "iceberg@.iou");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('iceberg@.iou');

        set_validated_input_text(validated_input, "iceberg@hello_world.iou");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('iceberg@hello_world.iou');

        set_validated_input_text(validated_input, "iceberg@@hello.iou");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('iceberg@@hello.iou');
    });

    test('Emails that do not contain the . before the top-level-domain are invalid',
         async () => {
        set_validated_input_text(validated_input, "iceberg@iou");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('iceberg@iou');
        expect(roster_form_component.is_valid).toBe(false);
        expect(roster.add_users_form_is_valid).toBe(false);
    });

    test('Emails where the top-level-domain is less than 2 characters are invalid',
         async () => {
        set_validated_input_text(validated_input, "iceberg@ae.");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('iceberg@ae.');

        set_validated_input_text(validated_input, "iceberg@ae.i");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('iceberg@ae.i');
    });

    test('Emails featuring invalid characters in the top-level domain are invalid',
         async () => {

        set_validated_input_text(validated_input, "iceberg@umich.sk8");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('iceberg@umich.sk8');

        set_validated_input_text(validated_input, "iceberg@umich.edu?");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(false);
        expect(validated_input_component.d_input_value).toBe('iceberg@umich.edu?');
    });

    test('When a user is added, the parent component is notified',
         async () => {
         set_validated_input_text(validated_input, "letitsnow@umich.edu  sevenEleven@umich.edu");
         await roster.$nextTick();

         expect(roster_form_component.is_valid).toBe(true);
         expect(validated_input_component.d_input_value).toBe(
             'letitsnow@umich.edu  sevenEleven@umich.edu'
         );
         expect(roster.add_users_form_is_valid).toBe(true);

         roster_form_wrapper.trigger('submit');
         await roster.$nextTick();

         expect(wrapper.emitted().add_users.length).toBe(1);
    });

    test('Validator function exposes addresses that do not adhere to the format specified ' +
         'in the valid email addresses regex',
         async () => {
         set_validated_input_text(validated_input, " angela");
         await roster.$nextTick();

         expect(validated_input_component.is_valid).toBe(false);
         expect(validated_input_component.d_input_value).toBe(' angela');
         expect(roster_form_component.is_valid).toBe(false);
         expect(roster.add_users_form_is_valid).toBe(false);

         set_validated_input_text(validated_input, " angela@umich");

         await roster.$nextTick();

         expect(validated_input_component.is_valid).toBe(false);
         expect(validated_input_component.d_input_value).toBe(' angela@umich');

         set_validated_input_text(validated_input, " angela@umich.edu");
         await roster.$nextTick();

         expect(validated_input_component.is_valid).toBe(true);
         expect(validated_input_component.d_input_value).toBe(' angela@umich.edu');
    });

    test('valid emails can be separated by colons, whitespace, or newlines', async () => {
        set_validated_input_text(
            validated_input, " roy@anderson.net\nclark@aol.com,pete@nd.edu     meredith@cmu.edu");
        await roster.$nextTick();

        expect(validated_input_component.is_valid).toBe(true);
        expect(validated_input_component.d_input_value).toBe(
            ' roy@anderson.net\nclark@aol.com,pete@nd.edu     meredith@cmu.edu'
        );
        expect(roster_form_component.is_valid).toBe(true);
        expect(roster.add_users_form_is_valid).toBe(true);
    });

    test('Validator function exposes the first invalid email address even when there' +
         ' may be many',
         async () => {
         set_validated_input_text(
             validated_input,
             " angela@umich.edu,oscar@umich.edu\nphyllis@@umich.edu\nryan@msuedu\ngabe");
         await roster.$nextTick();

         expect(validated_input_component.is_valid).toBe(false);
         expect(roster.first_invalid_email).toEqual("phyllis@@umich.edu");
    });

    test('Invalid usernames prevent form submission',
         async () => {
         let username_input = "michael@umich.edu\nhollyflax\nDarryl@umich.edu Bearyl@umich.edu " +
                              "erinH@umich.edu\ngabe@umich\nmeredith@umich.edu " +
                              "dwight@umich.edu\nandy@umich.\nphyllis@umich.edu" +
                              " pam@umich.edu jim@umich.edu " +
                              "oscar@umich.edu\n angela@umich.edu\n" +
                              "kevin@umich.edu,stanley@umich.edu " +
                              "kelly@umich.edu,\nryan@umich.edu,\n";

         set_validated_input_text(validated_input, username_input);
         await roster.$nextTick();

         expect(validated_input_component.is_valid).toBe(false);
         expect(validated_input_component.d_input_value).toBe(username_input);
         expect(roster.first_invalid_email).toEqual("hollyflax");

         let add_users_button = wrapper.find('#add-users-button');
         expect(add_users_button.is('[disabled]')).toBe(true);
         expect(roster.add_users_form_is_valid).toEqual(false);

         roster_form_wrapper.trigger('submit');
         await roster.$nextTick();

         expect(wrapper.emitted('add_users')).not.toBeTruthy();
    });

    test('If the textarea contains all valid emails, the parent component is notified ' +
         'when the add_users button is pressed.',
         async () => {

         let username_input = "michael@umich.edu\n\nDarryl@umich.edu Bearyl@umich.edu " +
                              "erinH@umich.edu\ngabe@umich.edu\nmeredith@umich.edu " +
                              "dwight@umich.edu\nandy@umich.com\nphyllis@umich.edu" +
                              " pam@umich.edu jim@umich.edu " +
                              "oscar@umich.edu\n angela@umich.edu\n" +
                              "kevin@umich.edu,stanley@umich.edu " +
                              "kelly@umich.edu,\nryan@umich.edu,";

         set_validated_input_text(validated_input, username_input);
         await roster.$nextTick();

         expect(validated_input_component.is_valid).toBe(true);
         expect(validated_input_component.d_input_value).toBe(username_input);
         expect(roster_form_component.is_valid).toBe(true);

         roster_form_wrapper.trigger('submit');
         await roster.$nextTick();

         expect(wrapper.emitted().add_users.length).toBe(1);
    });
});
